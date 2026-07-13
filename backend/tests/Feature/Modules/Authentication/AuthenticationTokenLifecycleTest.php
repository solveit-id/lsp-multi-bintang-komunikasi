<?php

declare(strict_types=1);

namespace Tests\Feature\Modules\Authentication;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

final class AuthenticationTokenLifecycleTest extends TestCase
{
    use RefreshDatabase;

    private const LOGIN_ENDPOINT = '/api/auth/login';

    private const LOGOUT_ENDPOINT = '/api/auth/logout';

    private const ME_ENDPOINT = '/api/auth/me';

    private const CHANGE_PASSWORD_ENDPOINT = '/api/auth/password';

    private const EMAIL = 'token.lifecycle.test@gmail.com';

    private const CURRENT_PASSWORD = 'CurrentPassword123!';

    private const NEW_PASSWORD = 'NewPassword123!';

    public function test_login_creates_a_personal_access_token(): void
    {
        $user = $this->createUser();

        $response = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => $user->email,
            'password' => self::CURRENT_PASSWORD,
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user',
                ],
            ]);

        $plainTextToken = $response->json('data.token');

        $this->assertIsString($plainTextToken);
        $this->assertNotSame('', $plainTextToken);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
        ]);

        $this->assertSame(1, $user->tokens()->count());
    }

    public function test_created_token_can_access_a_protected_endpoint(): void
    {
        $user = $this->createUser();

        $plainTextToken = $user
            ->createToken('protected-endpoint-test')
            ->plainTextToken;

        $response = $this
            ->withToken($plainTextToken)
            ->getJson(self::ME_ENDPOINT);

        $response
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_plain_text_token_is_not_stored_in_the_database(): void
    {
        $user = $this->createUser();

        $plainTextToken = $user
            ->createToken('token-storage-test')
            ->plainTextToken;

        $storedToken = PersonalAccessToken::query()
            ->where('tokenable_type', User::class)
            ->where('tokenable_id', $user->getKey())
            ->where('name', 'token-storage-test')
            ->firstOrFail();

        $tokenValue = $this->extractTokenValue($plainTextToken);

        $this->assertNotSame($tokenValue, $storedToken->token);
        $this->assertSame(
            hash('sha256', $tokenValue),
            $storedToken->token,
        );
    }

    public function test_logout_revokes_only_the_current_access_token(): void
    {
        $user = $this->createUser();

        $currentToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $secondaryToken = $user
            ->createToken('secondary-device')
            ->plainTextToken;

        $this->assertSame(2, $user->tokens()->count());

        $this
            ->withToken($currentToken)
            ->postJson(self::LOGOUT_ENDPOINT)
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
            'name' => 'current-device',
        ]);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
            'name' => 'secondary-device',
        ]);

        $this->assertSame(1, $user->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($currentToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($secondaryToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk();
    }

    public function test_change_password_revokes_all_access_tokens_for_the_user(): void
    {
        $user = $this->createUser();

        $currentToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $secondaryToken = $user
            ->createToken('secondary-device')
            ->plainTextToken;

        $this->assertSame(2, $user->tokens()->count());

        $this
            ->withToken($currentToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::CURRENT_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
        ]);

        $this->assertSame(0, $user->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($currentToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($secondaryToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();
    }

    public function test_revoke_all_does_not_remove_another_users_tokens(): void
    {
        $user = $this->createUser();

        $otherUser = User::factory()->create([
            'email' => 'other.token.lifecycle@gmail.com',
            'password' => Hash::make(self::CURRENT_PASSWORD),
        ]);

        $currentToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $otherUserToken = $otherUser
            ->createToken('other-user-device')
            ->plainTextToken;

        $this
            ->withToken($currentToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::CURRENT_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
        ]);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $otherUser->getKey(),
            'name' => 'other-user-device',
        ]);

        $this->assertSame(0, $user->tokens()->count());
        $this->assertSame(1, $otherUser->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($otherUserToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.uuid', $otherUser->uuid);
    }

    public function test_invalid_access_token_cannot_access_a_protected_endpoint(): void
    {
        $this
            ->withToken('invalid-personal-access-token')
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();
    }

    public function test_deleted_access_token_cannot_be_used_again(): void
    {
        $user = $this->createUser();

        $plainTextToken = $user
            ->createToken('deleted-token-test')
            ->plainTextToken;

        $user->tokens()->delete();

        $this->assertSame(0, $user->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($plainTextToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();
    }

    public function test_failed_password_change_does_not_revoke_access_tokens(): void
    {
        $user = $this->createUser();

        $currentToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $secondaryToken = $user
            ->createToken('secondary-device')
            ->plainTextToken;

        $this
            ->withToken($currentToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => 'IncorrectPassword123!',
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertUnauthorized();

        $this->assertSame(2, $user->tokens()->count());

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
            'name' => 'current-device',
        ]);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
            'name' => 'secondary-device',
        ]);

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($currentToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($secondaryToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk();
    }

    private function createUser(): User
    {
        return User::factory()->create([
            'name' => 'Token Lifecycle Test',
            'email' => self::EMAIL,
            'password' => Hash::make(self::CURRENT_PASSWORD),
        ]);
    }

    private function extractTokenValue(string $plainTextToken): string
    {
        $separatorPosition = strpos($plainTextToken, '|');

        if ($separatorPosition === false) {
            return $plainTextToken;
        }

        return substr(
            $plainTextToken,
            $separatorPosition + 1,
        );
    }
}

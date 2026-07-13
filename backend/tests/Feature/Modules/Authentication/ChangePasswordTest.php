<?php

declare(strict_types=1);

namespace Tests\Feature\Modules\Authentication;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

final class ChangePasswordTest extends TestCase
{
    use RefreshDatabase;

    private const CHANGE_PASSWORD_ENDPOINT = '/api/auth/password';

    private const LOGIN_ENDPOINT = '/api/auth/login';

    private const ME_ENDPOINT = '/api/auth/me';

    private const EMAIL = 'change.password.test@gmail.com';

    private const CURRENT_PASSWORD = 'CurrentPassword123!';

    private const NEW_PASSWORD = 'NewPassword123!';

    public function test_authenticated_user_can_change_password(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('change-password-test')
            ->plainTextToken;

        $originalPasswordHash = $user->password;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::CURRENT_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ]);

        $response->assertOk();

        $user->refresh();

        $this->assertNotSame(
            $originalPasswordHash,
            $user->password,
        );

        $this->assertTrue(
            Hash::check(self::NEW_PASSWORD, $user->password),
        );

        $this->assertFalse(
            Hash::check(self::CURRENT_PASSWORD, $user->password),
        );
    }

    public function test_unauthenticated_user_cannot_change_password(): void
    {
        $response = $this->putJson(
            self::CHANGE_PASSWORD_ENDPOINT,
            [
                'current_password' => self::CURRENT_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ],
        );

        $response->assertUnauthorized();
    }

    public function test_current_password_is_required(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('change-password-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password']);

        $user->refresh();

        $this->assertTrue(
            Hash::check(self::CURRENT_PASSWORD, $user->password),
        );
    }

    public function test_new_password_is_required(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('change-password-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::CURRENT_PASSWORD,
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);

        $user->refresh();

        $this->assertTrue(
            Hash::check(self::CURRENT_PASSWORD, $user->password),
        );
    }

    public function test_current_password_must_be_correct(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('change-password-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => 'IncorrectPassword123!',
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ]);

        $response->assertUnauthorized();

        $user->refresh();

        $this->assertTrue(
            Hash::check(self::CURRENT_PASSWORD, $user->password),
        );

        $this->assertFalse(
            Hash::check(self::NEW_PASSWORD, $user->password),
        );
    }

    public function test_new_password_confirmation_must_match(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('change-password-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::CURRENT_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => 'DifferentPassword123!',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);

        $user->refresh();

        $this->assertTrue(
            Hash::check(self::CURRENT_PASSWORD, $user->password),
        );
    }

    public function test_new_password_must_have_a_minimum_length(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('change-password-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::CURRENT_PASSWORD,
                'password' => 'short',
                'password_confirmation' => 'short',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);

        $user->refresh();

        $this->assertTrue(
            Hash::check(self::CURRENT_PASSWORD, $user->password),
        );
    }

    public function test_new_password_must_be_different_from_current_password(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('change-password-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::CURRENT_PASSWORD,
                'password' => self::CURRENT_PASSWORD,
                'password_confirmation' => self::CURRENT_PASSWORD,
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);

        $user->refresh();

        $this->assertTrue(
            Hash::check(self::CURRENT_PASSWORD, $user->password),
        );
    }

    public function test_all_user_access_tokens_are_revoked_after_password_change(): void
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

        $this->assertSame(0, $user->tokens()->count());

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
        ]);

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

    public function test_access_tokens_remain_active_when_password_change_fails(): void
    {
        $user = $this->createUser();

        $currentToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $secondaryToken = $user
            ->createToken('secondary-device')
            ->plainTextToken;

        $response = $this
            ->withToken($currentToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => 'IncorrectPassword123!',
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ]);

        $response->assertUnauthorized();

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

    public function test_password_change_does_not_revoke_another_users_tokens(): void
    {
        $user = $this->createUser();

        $otherUser = User::factory()->create([
            'email' => 'other.change.password.test@gmail.com',
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

        $this->assertSame(0, $user->tokens()->count());
        $this->assertSame(1, $otherUser->tokens()->count());

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $otherUser->getKey(),
            'name' => 'other-user-device',
        ]);

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($otherUserToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.uuid', $otherUser->uuid);
    }

    public function test_old_password_cannot_be_used_to_login_after_password_change(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('change-password-test')
            ->plainTextToken;

        $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::CURRENT_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertOk();

        $this->app['auth']->forgetGuards();

        $response = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => $user->email,
            'password' => self::CURRENT_PASSWORD,
        ]);

        $response->assertUnauthorized();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_new_password_can_be_used_to_login_after_password_change(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('change-password-test')
            ->plainTextToken;

        $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::CURRENT_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);

        $this->app['auth']->forgetGuards();

        $response = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => $user->email,
            'password' => self::NEW_PASSWORD,
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user',
                ],
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_change_password_response_does_not_expose_sensitive_information(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('change-password-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::CURRENT_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ]);

        $response
            ->assertOk()
            ->assertJsonMissingPath('data.current_password')
            ->assertJsonMissingPath('data.password')
            ->assertJsonMissingPath('data.password_confirmation')
            ->assertJsonMissingPath('data.token')
            ->assertJsonMissingPath('current_password')
            ->assertJsonMissingPath('password')
            ->assertJsonMissingPath('token');
    }

    private function createUser(): User
    {
        return User::factory()->create([
            'name' => 'Change Password Test',
            'email' => self::EMAIL,
            'password' => Hash::make(self::CURRENT_PASSWORD),
        ]);
    }
}

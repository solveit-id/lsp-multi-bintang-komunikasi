<?php

declare(strict_types=1);

namespace Tests\Feature\Modules\Authentication;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

final class AuthenticationCrossFeatureTest extends TestCase
{
    use RefreshDatabase;

    private const LOGIN_ENDPOINT = '/api/auth/login';

    private const LOGOUT_ENDPOINT = '/api/auth/logout';

    private const ME_ENDPOINT = '/api/auth/me';

    private const PROFILE_ENDPOINT = '/api/auth/profile';

    private const CHANGE_PASSWORD_ENDPOINT = '/api/auth/password';

    private const ORIGINAL_NAME = 'Original User Name';

    private const UPDATED_NAME = 'Testing User';

    private const ORIGINAL_EMAIL = 'authentication.cross.feature@gmail.com';

    private const UPDATED_EMAIL = 'authentication.cross.updated@gmail.com';

    private const ORIGINAL_PASSWORD = 'OriginalPassword123!';

    private const NEW_PASSWORD = 'NewPassword123!';

    public function test_complete_authentication_feature_flow(): void
    {
        $user = $this->createUser();

        /*
         * Step 1 — Login using the original credentials.
         */
        $loginResponse = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => self::ORIGINAL_EMAIL,
            'password' => self::ORIGINAL_PASSWORD,
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonPath('data.user.uuid', $user->uuid)
            ->assertJsonPath('data.user.name', self::ORIGINAL_NAME)
            ->assertJsonPath('data.user.email', self::ORIGINAL_EMAIL)
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user' => [
                        'uuid',
                        'name',
                        'email',
                    ],
                ],
            ]);

        $originalToken = $loginResponse->json('data.token');

        $this->assertIsString($originalToken);
        $this->assertNotSame('', $originalToken);
        $this->assertSame(1, $user->tokens()->count());

        /*
         * Step 2 — Retrieve the current authenticated user.
         */
        $this->app['auth']->forgetGuards();

        $this
            ->withToken($originalToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', self::ORIGINAL_NAME)
            ->assertJsonPath('data.email', self::ORIGINAL_EMAIL)
            ->assertJsonMissingPath('data.id')
            ->assertJsonMissingPath('data.password');

        /*
         * Step 3 — Update the authenticated user's profile.
         */
        $this->app['auth']->forgetGuards();

        $this
            ->withToken($originalToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => self::UPDATED_NAME,
                'email' => self::UPDATED_EMAIL,
            ])
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', self::UPDATED_NAME)
            ->assertJsonPath('data.email', self::UPDATED_EMAIL);

        $this->assertDatabaseHas('users', [
            'id' => $user->getKey(),
            'uuid' => $user->uuid,
            'name' => self::UPDATED_NAME,
            'email' => self::UPDATED_EMAIL,
        ]);

        $this->assertSame(1, $user->tokens()->count());

        /*
         * Step 4 — Ensure /me returns the updated profile.
         */
        $this->app['auth']->forgetGuards();

        $this
            ->withToken($originalToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', self::UPDATED_NAME)
            ->assertJsonPath('data.email', self::UPDATED_EMAIL);

        /*
         * Step 5 — Create a secondary device token before changing password.
         */
        $secondaryToken = $user
            ->createToken('secondary-device')
            ->plainTextToken;

        $this->assertSame(2, $user->tokens()->count());

        /*
         * Step 6 — Change the password using the original password.
         */
        $this->app['auth']->forgetGuards();

        $this
            ->withToken($originalToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::ORIGINAL_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertOk()
            ->assertJsonMissingPath('data.password')
            ->assertJsonMissingPath('data.current_password')
            ->assertJsonMissingPath('data.token');

        $user->refresh();

        $this->assertTrue(
            Hash::check(self::NEW_PASSWORD, $user->password),
        );

        $this->assertFalse(
            Hash::check(self::ORIGINAL_PASSWORD, $user->password),
        );

        $this->assertSame(0, $user->tokens()->count());

        /*
         * Step 7 — Ensure all previous tokens are revoked.
         */
        $this->app['auth']->forgetGuards();

        $this
            ->withToken($originalToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($secondaryToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();

        /*
         * Step 8 — Login with the original password must fail.
         */
        $this->app['auth']->forgetGuards();

        $this
            ->postJson(self::LOGIN_ENDPOINT, [
                'email' => self::UPDATED_EMAIL,
                'password' => self::ORIGINAL_PASSWORD,
            ])
            ->assertUnauthorized();

        $this->assertDatabaseCount('personal_access_tokens', 0);

        /*
         * Step 9 — Login with the new password must succeed.
         */
        $newLoginResponse = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => self::UPDATED_EMAIL,
            'password' => self::NEW_PASSWORD,
        ]);

        $newLoginResponse
            ->assertOk()
            ->assertJsonPath('data.user.uuid', $user->uuid)
            ->assertJsonPath('data.user.name', self::UPDATED_NAME)
            ->assertJsonPath('data.user.email', self::UPDATED_EMAIL)
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user',
                ],
            ]);

        $newToken = $newLoginResponse->json('data.token');

        $this->assertIsString($newToken);
        $this->assertNotSame('', $newToken);
        $this->assertSame(1, $user->tokens()->count());

        /*
         * Step 10 — The new token must access /me successfully.
         */
        $this->app['auth']->forgetGuards();

        $this
            ->withToken($newToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', self::UPDATED_NAME)
            ->assertJsonPath('data.email', self::UPDATED_EMAIL);

        /*
         * Step 11 — Logout using the new token.
         */
        $this->app['auth']->forgetGuards();

        $this
            ->withToken($newToken)
            ->postJson(self::LOGOUT_ENDPOINT)
            ->assertOk();

        $this->assertSame(0, $user->tokens()->count());

        /*
         * Step 12 — The logged-out token must no longer be usable.
         */
        $this->app['auth']->forgetGuards();

        $this
            ->withToken($newToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();
    }

    private function createUser(): User
    {
        return User::factory()->create([
            'name' => self::ORIGINAL_NAME,
            'email' => self::ORIGINAL_EMAIL,
            'password' => Hash::make(self::ORIGINAL_PASSWORD),
        ]);
    }
}

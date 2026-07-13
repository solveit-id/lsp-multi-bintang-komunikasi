<?php

declare(strict_types=1);

namespace Tests\Feature\Modules\Authentication;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

final class AuthenticationSecurityTest extends TestCase
{
    use RefreshDatabase;

    private const LOGIN_ENDPOINT = '/api/auth/login';

    private const LOGOUT_ENDPOINT = '/api/auth/logout';

    private const ME_ENDPOINT = '/api/auth/me';

    private const PROFILE_ENDPOINT = '/api/auth/profile';

    private const CHANGE_PASSWORD_ENDPOINT = '/api/auth/password';

    private const PASSWORD = 'Password123!';

    private const NEW_PASSWORD = 'NewPassword123!';

    public function test_protected_authentication_endpoints_reject_unauthenticated_requests(): void
    {
        $this
            ->postJson(self::LOGOUT_ENDPOINT)
            ->assertUnauthorized();

        $this
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();

        $this
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Unauthorized User',
                'email' => 'unauthorized.profile@gmail.com',
            ])
            ->assertUnauthorized();

        $this
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertUnauthorized();
    }

    public function test_invalid_access_token_is_rejected_by_all_protected_endpoints(): void
    {
        $invalidToken = 'invalid-personal-access-token';

        $this
            ->withToken($invalidToken)
            ->postJson(self::LOGOUT_ENDPOINT)
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($invalidToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($invalidToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Invalid Token User',
                'email' => 'invalid.token.profile@gmail.com',
            ])
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($invalidToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertUnauthorized();
    }

    public function test_revoked_access_token_cannot_access_any_protected_endpoint(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('revoked-security-token')
            ->plainTextToken;

        $user->tokens()->delete();

        $this->assertSame(0, $user->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->postJson(self::LOGOUT_ENDPOINT)
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Revoked Token User',
                'email' => 'revoked.token.profile@gmail.com',
            ])
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_only_retrieve_their_own_identity(): void
    {
        $user = $this->createUser([
            'name' => 'Authenticated User',
            'email' => 'authenticated.security@gmail.com',
        ]);

        $otherUser = $this->createUser([
            'name' => 'Other User',
            'email' => 'other.security@gmail.com',
        ]);

        $accessToken = $user
            ->createToken('identity-security-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT);

        $response
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', $user->name)
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonMissing([
                'uuid' => $otherUser->uuid,
                'email' => $otherUser->email,
            ]);
    }

    public function test_profile_update_only_modifies_the_authenticated_user(): void
    {
        $user = $this->createUser([
            'name' => 'Current User',
            'email' => 'current.security@gmail.com',
        ]);

        $otherUser = $this->createUser([
            'name' => 'Other User',
            'email' => 'other.profile.security@gmail.com',
        ]);

        $accessToken = $user
            ->createToken('profile-isolation-test')
            ->plainTextToken;

        $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Updated Current User',
                'email' => 'updated.current.security@gmail.com',
                'user_id' => $otherUser->getKey(),
                'user_uuid' => $otherUser->uuid,
            ])
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', 'Updated Current User')
            ->assertJsonPath(
                'data.email',
                'updated.current.security@gmail.com',
            );

        $this->assertDatabaseHas('users', [
            'id' => $user->getKey(),
            'uuid' => $user->uuid,
            'name' => 'Updated Current User',
            'email' => 'updated.current.security@gmail.com',
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $otherUser->getKey(),
            'uuid' => $otherUser->uuid,
            'name' => 'Other User',
            'email' => 'other.profile.security@gmail.com',
        ]);
    }

    public function test_profile_update_cannot_modify_protected_user_attributes(): void
    {
        $originalPassword = self::PASSWORD;

        $user = $this->createUser([
            'name' => 'Protected User',
            'email' => 'protected.security@gmail.com',
            'password' => Hash::make($originalPassword),
        ]);

        $originalUuid = $user->uuid;

        $accessToken = $user
            ->createToken('mass-assignment-security-test')
            ->plainTextToken;

        $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Updated Protected User',
                'email' => 'updated.protected.security@gmail.com',
                'uuid' => '01900000-0000-7000-8000-000000000000',
                'password' => 'InjectedPassword123!',
                'remember_token' => 'injected-remember-token',
                'email_verified_at' => now()->toDateTimeString(),
                'is_active' => false,
                'role' => 'super-admin',
            ])
            ->assertOk();

        $user->refresh();

        $this->assertSame($originalUuid, $user->uuid);
        $this->assertTrue(
            Hash::check($originalPassword, $user->password),
        );

        $this->assertSame(
            'Updated Protected User',
            $user->name,
        );

        $this->assertSame(
            'updated.protected.security@gmail.com',
            $user->email,
        );
    }

    public function test_authentication_responses_do_not_expose_sensitive_fields(): void
    {
        $user = $this->createUser([
            'email' => 'response.security@gmail.com',
        ]);

        $loginResponse = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => $user->email,
            'password' => self::PASSWORD,
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonMissingPath('data.user.id')
            ->assertJsonMissingPath('data.user.password')
            ->assertJsonMissingPath('data.user.remember_token')
            ->assertJsonMissingPath('data.user.tokens')
            ->assertJsonMissingPath('data.user.current_access_token');

        $accessToken = $loginResponse->json('data.token');

        $this->assertIsString($accessToken);

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonMissingPath('data.id')
            ->assertJsonMissingPath('data.password')
            ->assertJsonMissingPath('data.remember_token')
            ->assertJsonMissingPath('data.tokens')
            ->assertJsonMissingPath('data.current_access_token');
    }

    public function test_failed_login_does_not_reveal_whether_the_account_exists(): void
    {
        $user = $this->createUser([
            'email' => 'credential.security@gmail.com',
        ]);

        $existingUserResponse = $this->postJson(
            self::LOGIN_ENDPOINT,
            [
                'email' => $user->email,
                'password' => 'IncorrectPassword123!',
            ],
        );

        $unknownUserResponse = $this->postJson(
            self::LOGIN_ENDPOINT,
            [
                'email' => 'unknown.credential.security@gmail.com',
                'password' => 'IncorrectPassword123!',
            ],
        );

        $existingUserResponse->assertUnauthorized();
        $unknownUserResponse->assertUnauthorized();

        $this->assertSame(
            $existingUserResponse->json('message'),
            $unknownUserResponse->json('message'),
        );

        $existingUserResponse
            ->assertJsonMissingPath('data.user')
            ->assertJsonMissingPath('data.token');

        $unknownUserResponse
            ->assertJsonMissingPath('data.user')
            ->assertJsonMissingPath('data.token');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_failed_password_change_does_not_modify_password_or_tokens(): void
    {
        $user = $this->createUser([
            'email' => 'failed.password.security@gmail.com',
        ]);

        $currentToken = $user
            ->createToken('current-security-device')
            ->plainTextToken;

        $secondaryToken = $user
            ->createToken('secondary-security-device')
            ->plainTextToken;

        $originalPasswordHash = $user->password;

        $this
            ->withToken($currentToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => 'IncorrectPassword123!',
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertUnauthorized();

        $user->refresh();

        $this->assertSame(
            $originalPasswordHash,
            $user->password,
        );

        $this->assertTrue(
            Hash::check(self::PASSWORD, $user->password),
        );

        $this->assertSame(2, $user->tokens()->count());

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

    public function test_password_change_revokes_only_the_target_users_tokens(): void
    {
        $user = $this->createUser([
            'email' => 'target.password.security@gmail.com',
        ]);

        $otherUser = $this->createUser([
            'email' => 'isolated.password.security@gmail.com',
        ]);

        $userToken = $user
            ->createToken('target-device')
            ->plainTextToken;

        $otherUserToken = $otherUser
            ->createToken('isolated-device')
            ->plainTextToken;

        $this
            ->withToken($userToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertOk();

        $this->assertSame(0, $user->tokens()->count());
        $this->assertSame(1, $otherUser->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($userToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($otherUserToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.uuid', $otherUser->uuid);
    }

    /**
     * Create a user with stable authentication credentials.
     *
     * @param  array<string, mixed>  $attributes
     */
    private function createUser(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'name' => 'Authentication Security User',
            'email' => 'authentication.security@gmail.com',
            'password' => Hash::make(self::PASSWORD),
        ], $attributes));
    }
}

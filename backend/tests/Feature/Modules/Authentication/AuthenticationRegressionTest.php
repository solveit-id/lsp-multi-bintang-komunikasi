<?php

declare(strict_types=1);

namespace Tests\Feature\Modules\Authentication;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

final class AuthenticationRegressionTest extends TestCase
{
    use RefreshDatabase;

    private const LOGIN_ENDPOINT = '/api/auth/login';

    private const LOGOUT_ENDPOINT = '/api/auth/logout';

    private const ME_ENDPOINT = '/api/auth/me';

    private const PROFILE_ENDPOINT = '/api/auth/profile';

    private const CHANGE_PASSWORD_ENDPOINT = '/api/auth/password';

    private const ORIGINAL_EMAIL = 'authentication.regression@gmail.com';

    private const UPDATED_EMAIL = 'authentication.regression.updated@gmail.com';

    private const ORIGINAL_PASSWORD = 'OriginalPassword123!';

    private const NEW_PASSWORD = 'NewPassword123!';

    public function test_login_still_creates_a_valid_access_token(): void
    {
        $user = $this->createUser();

        $response = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => $user->email,
            'password' => self::ORIGINAL_PASSWORD,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.user.uuid', $user->uuid)
            ->assertJsonPath('data.user.email', $user->email)
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

        $accessToken = $response->json('data.token');

        $this->assertIsString($accessToken);
        $this->assertNotSame('', $accessToken);
        $this->assertSame(1, $user->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid);
    }

    public function test_logout_still_revokes_only_the_current_token(): void
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
            ->postJson(self::LOGOUT_ENDPOINT)
            ->assertOk();

        $this->assertSame(1, $user->tokens()->count());

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

    public function test_profile_update_does_not_regress_token_validity(): void
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
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Updated Regression User',
                'email' => self::UPDATED_EMAIL,
            ])
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', 'Updated Regression User')
            ->assertJsonPath('data.email', self::UPDATED_EMAIL);

        $this->assertSame(2, $user->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($currentToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.email', self::UPDATED_EMAIL);

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($secondaryToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.email', self::UPDATED_EMAIL);
    }

    public function test_me_still_returns_the_latest_persisted_profile(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('me-regression-test')
            ->plainTextToken;

        $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Latest Regression User',
                'email' => self::UPDATED_EMAIL,
            ])
            ->assertOk();

        $user->refresh();

        $this->assertSame('Latest Regression User', $user->name);
        $this->assertSame(self::UPDATED_EMAIL, $user->email);

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', 'Latest Regression User')
            ->assertJsonPath('data.email', self::UPDATED_EMAIL)
            ->assertJsonMissingPath('data.id')
            ->assertJsonMissingPath('data.password');
    }

    public function test_change_password_still_revokes_all_existing_tokens(): void
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
                'current_password' => self::ORIGINAL_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertOk();

        $user->refresh();

        $this->assertTrue(
            Hash::check(self::NEW_PASSWORD, $user->password),
        );

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

    public function test_old_password_is_rejected_and_new_password_is_accepted_after_change(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('password-regression-test')
            ->plainTextToken;

        $this
            ->withToken($accessToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::ORIGINAL_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertOk();

        $this->app['auth']->forgetGuards();

        $this
            ->postJson(self::LOGIN_ENDPOINT, [
                'email' => $user->email,
                'password' => self::ORIGINAL_PASSWORD,
            ])
            ->assertUnauthorized();

        $this->assertDatabaseCount('personal_access_tokens', 0);

        $newLoginResponse = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => $user->email,
            'password' => self::NEW_PASSWORD,
        ]);

        $newLoginResponse
            ->assertOk()
            ->assertJsonPath('data.user.uuid', $user->uuid)
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user',
                ],
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_failed_profile_update_does_not_partially_modify_user_data(): void
    {
        $user = $this->createUser();

        User::factory()->create([
            'email' => self::UPDATED_EMAIL,
        ]);

        $accessToken = $user
            ->createToken('profile-failure-regression')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Partially Updated Name',
                'email' => self::UPDATED_EMAIL,
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $user->refresh();

        $this->assertSame(
            'Authentication Regression User',
            $user->name,
        );

        $this->assertSame(
            self::ORIGINAL_EMAIL,
            $user->email,
        );

        $this->assertSame(1, $user->tokens()->count());
    }

    public function test_failed_password_change_does_not_partially_modify_state(): void
    {
        $user = $this->createUser();

        $currentToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $secondaryToken = $user
            ->createToken('secondary-device')
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
            Hash::check(self::ORIGINAL_PASSWORD, $user->password),
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

    public function test_authentication_operations_remain_isolated_between_users(): void
    {
        $user = $this->createUser();

        $otherUser = User::factory()->create([
            'name' => 'Other Regression User',
            'email' => 'authentication.other.regression@gmail.com',
            'password' => Hash::make(self::ORIGINAL_PASSWORD),
        ]);

        $userToken = $user
            ->createToken('user-device')
            ->plainTextToken;

        $otherUserToken = $otherUser
            ->createToken('other-user-device')
            ->plainTextToken;

        $this
            ->withToken($userToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Updated Authentication User',
                'email' => self::UPDATED_EMAIL,
            ])
            ->assertOk();

        $this
            ->withToken($userToken)
            ->putJson(self::CHANGE_PASSWORD_ENDPOINT, [
                'current_password' => self::ORIGINAL_PASSWORD,
                'password' => self::NEW_PASSWORD,
                'password_confirmation' => self::NEW_PASSWORD,
            ])
            ->assertOk();

        $otherUser->refresh();

        $this->assertSame(
            'Other Regression User',
            $otherUser->name,
        );

        $this->assertSame(
            'authentication.other.regression@gmail.com',
            $otherUser->email,
        );

        $this->assertTrue(
            Hash::check(self::ORIGINAL_PASSWORD, $otherUser->password),
        );

        $this->assertSame(1, $otherUser->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($otherUserToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.uuid', $otherUser->uuid);
    }

    public function test_primary_authentication_response_contracts_remain_stable(): void
    {
        $user = $this->createUser();

        $loginResponse = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => $user->email,
            'password' => self::ORIGINAL_PASSWORD,
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user' => [
                        'uuid',
                        'name',
                        'email',
                    ],
                ],
            ])
            ->assertJsonMissingPath('data.user.id')
            ->assertJsonMissingPath('data.user.password');

        $accessToken = $loginResponse->json('data.token');

        $this->assertIsString($accessToken);

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'name',
                    'email',
                ],
            ])
            ->assertJsonMissingPath('data.id')
            ->assertJsonMissingPath('data.password');

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Stable Contract User',
                'email' => self::UPDATED_EMAIL,
            ])
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'name',
                    'email',
                ],
            ])
            ->assertJsonMissingPath('data.id')
            ->assertJsonMissingPath('data.password');
    }

    private function createUser(): User
    {
        return User::factory()->create([
            'name' => 'Authentication Regression User',
            'email' => self::ORIGINAL_EMAIL,
            'password' => Hash::make(self::ORIGINAL_PASSWORD),
        ]);
    }
}

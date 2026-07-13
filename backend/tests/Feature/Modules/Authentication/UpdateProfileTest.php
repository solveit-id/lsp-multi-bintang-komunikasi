<?php

declare(strict_types=1);

namespace Tests\Feature\Modules\Authentication;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

final class UpdateProfileTest extends TestCase
{
    use RefreshDatabase;

    private const PROFILE_ENDPOINT = '/api/auth/profile';

    private const ME_ENDPOINT = '/api/auth/me';

    private const CURRENT_EMAIL = 'profile.current.test@gmail.com';

    private const UPDATED_EMAIL = 'profile.updated.test@gmail.com';

    public function test_authenticated_user_can_update_profile(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('profile-update-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Testing User',
                'email' => self::UPDATED_EMAIL,
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', 'Testing User')
            ->assertJsonPath('data.email', self::UPDATED_EMAIL)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'name',
                    'email',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->getKey(),
            'uuid' => $user->uuid,
            'name' => 'Testing User',
            'email' => self::UPDATED_EMAIL,
        ]);
    }

    public function test_unauthenticated_user_cannot_update_profile(): void
    {
        $response = $this->putJson(self::PROFILE_ENDPOINT, [
            'name' => 'Testing User',
            'email' => self::UPDATED_EMAIL,
        ]);

        $response->assertUnauthorized();
    }

    public function test_name_is_required_when_updating_profile(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('profile-update-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'email' => self::UPDATED_EMAIL,
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);

        $this->assertDatabaseHas('users', [
            'id' => $user->getKey(),
            'name' => 'Old Profile Name',
            'email' => self::CURRENT_EMAIL,
        ]);
    }

    public function test_email_is_required_when_updating_profile(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('profile-update-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Testing User',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertDatabaseHas('users', [
            'id' => $user->getKey(),
            'name' => 'Old Profile Name',
            'email' => self::CURRENT_EMAIL,
        ]);
    }

    public function test_email_must_have_a_valid_format(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('profile-update-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Testing User',
                'email' => 'invalid-email-address',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertDatabaseHas('users', [
            'id' => $user->getKey(),
            'email' => self::CURRENT_EMAIL,
        ]);
    }

    public function test_user_cannot_use_an_email_owned_by_another_user(): void
    {
        $user = $this->createUser();

        $otherUser = User::factory()->create([
            'email' => 'profile.other.test@gmail.com',
        ]);

        $accessToken = $user
            ->createToken('profile-update-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Updated Name',
                'email' => $otherUser->email,
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertDatabaseHas('users', [
            'id' => $user->getKey(),
            'name' => 'Old Profile Name',
            'email' => self::CURRENT_EMAIL,
        ]);
    }

    public function test_user_can_keep_their_current_email_address(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('profile-update-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Updated Profile Name',
                'email' => self::CURRENT_EMAIL,
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', 'Updated Profile Name')
            ->assertJsonPath('data.email', self::CURRENT_EMAIL);

        $this->assertDatabaseHas('users', [
            'id' => $user->getKey(),
            'name' => 'Updated Profile Name',
            'email' => self::CURRENT_EMAIL,
        ]);
    }

    public function test_profile_input_is_normalized_before_persistence(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('profile-update-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => '  Testing User  ',
                'email' => '  PROFILE.UPDATED.TEST@GMAIL.COM  ',
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.name', 'Testing User')
            ->assertJsonPath('data.email', self::UPDATED_EMAIL);

        $this->assertDatabaseHas('users', [
            'id' => $user->getKey(),
            'name' => 'Testing User',
            'email' => self::UPDATED_EMAIL,
        ]);
    }

    public function test_fields_outside_the_profile_contract_are_not_updated(): void
    {
        $originalPassword = 'OriginalPassword123!';

        $user = $this->createUser([
            'password' => Hash::make($originalPassword),
        ]);

        $originalUuid = $user->uuid;

        $accessToken = $user
            ->createToken('profile-update-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Testing User',
                'email' => self::UPDATED_EMAIL,
                'uuid' => '01900000-0000-7000-8000-000000000000',
                'password' => 'UnauthorizedPassword123!',
                'remember_token' => 'unauthorized-token',
            ]);

        $response->assertOk();

        $user->refresh();

        $this->assertSame($originalUuid, $user->uuid);
        $this->assertTrue(
            Hash::check($originalPassword, $user->password),
        );

        $this->assertDatabaseHas('users', [
            'id' => $user->getKey(),
            'uuid' => $originalUuid,
            'name' => 'Testing User',
            'email' => self::UPDATED_EMAIL,
        ]);
    }

    public function test_profile_response_does_not_expose_sensitive_information(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('profile-update-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Testing User',
                'email' => self::UPDATED_EMAIL,
            ]);

        $response
            ->assertOk()
            ->assertJsonMissingPath('data.id')
            ->assertJsonMissingPath('data.password')
            ->assertJsonMissingPath('data.remember_token')
            ->assertJsonMissingPath('data.tokens')
            ->assertJsonMissingPath('password')
            ->assertJsonMissingPath('token');
    }

    public function test_access_token_remains_valid_after_profile_update(): void
    {
        $user = $this->createUser();

        $accessToken = $user
            ->createToken('profile-update-test')
            ->plainTextToken;

        $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Testing User',
                'email' => self::UPDATED_EMAIL,
            ])
            ->assertOk();

        $this->assertSame(1, $user->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', 'Testing User')
            ->assertJsonPath('data.email', self::UPDATED_EMAIL);
    }

    public function test_profile_update_does_not_revoke_secondary_tokens(): void
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
                'name' => 'Testing User',
                'email' => self::UPDATED_EMAIL,
            ])
            ->assertOk();

        $this->assertSame(2, $user->tokens()->count());

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($secondaryToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk()
            ->assertJsonPath('data.email', self::UPDATED_EMAIL);
    }

    /**
     * Create a user with stable profile data.
     *
     * @param  array<string, mixed>  $attributes
     */
    private function createUser(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'name' => 'Old Profile Name',
            'email' => self::CURRENT_EMAIL,
        ], $attributes));
    }
}

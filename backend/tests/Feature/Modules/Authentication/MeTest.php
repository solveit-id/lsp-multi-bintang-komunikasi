<?php

declare(strict_types=1);

namespace Tests\Feature\Modules\Authentication;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class MeTest extends TestCase
{
    use RefreshDatabase;

    private const ME_ENDPOINT = '/api/auth/me';

    private const PROFILE_ENDPOINT = '/api/auth/profile';

    public function test_authenticated_user_can_retrieve_their_information(): void
    {
        $user = User::factory()->create([
            'name' => 'Testing User',
            'email' => 'Testing.me.test@gmail.com',
        ]);

        $accessToken = $user
            ->createToken('me-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT);

        $response
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', $user->name)
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'name',
                    'email',
                ],
            ]);
    }

    public function test_me_response_uses_public_uuid_instead_of_internal_id(): void
    {
        $user = User::factory()->create();

        $accessToken = $user
            ->createToken('me-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT);

        $response
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonMissingPath('data.id');
    }

    public function test_me_response_does_not_expose_sensitive_information(): void
    {
        $user = User::factory()->create();

        $accessToken = $user
            ->createToken('me-test')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT);

        $response
            ->assertOk()
            ->assertJsonMissingPath('data.password')
            ->assertJsonMissingPath('data.remember_token')
            ->assertJsonMissingPath('data.tokens')
            ->assertJsonMissingPath('data.current_access_token')
            ->assertJsonMissingPath('password')
            ->assertJsonMissingPath('token');
    }

    public function test_unauthenticated_user_cannot_access_me_endpoint(): void
    {
        $response = $this->getJson(self::ME_ENDPOINT);

        $response->assertUnauthorized();
    }

    public function test_revoked_access_token_cannot_access_me_endpoint(): void
    {
        $user = User::factory()->create();

        $accessToken = $user
            ->createToken('me-test')
            ->plainTextToken;

        $user->tokens()->delete();

        $this->app['auth']->forgetGuards();

        $response = $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT);

        $response->assertUnauthorized();
    }

    public function test_me_returns_updated_profile_information(): void
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old.me.test@gmail.com',
        ]);

        $accessToken = $user
            ->createToken('me-test')
            ->plainTextToken;

        $this
            ->withToken($accessToken)
            ->putJson(self::PROFILE_ENDPOINT, [
                'name' => 'Testing User',
                'email' => 'testing.updated.me.test@gmail.com',
            ])
            ->assertOk();

        $this->app['auth']->forgetGuards();

        $response = $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT);

        $response
            ->assertOk()
            ->assertJsonPath('data.uuid', $user->uuid)
            ->assertJsonPath('data.name', 'Testing User')
            ->assertJsonPath('data.email', 'testing.updated.me.test@gmail.com');
    }
}

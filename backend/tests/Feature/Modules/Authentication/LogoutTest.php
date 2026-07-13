<?php

declare(strict_types=1);

namespace Tests\Feature\Modules\Authentication;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class LogoutTest extends TestCase
{
    use RefreshDatabase;

    private const LOGOUT_ENDPOINT = '/api/auth/logout';

    private const ME_ENDPOINT = '/api/auth/me';

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();

        $accessToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $this->assertSame(1, $user->tokens()->count());

        $response = $this
            ->withToken($accessToken)
            ->postJson(self::LOGOUT_ENDPOINT);

        $response->assertOk();

        $this->assertSame(0, $user->tokens()->count());

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
            'name' => 'current-device',
        ]);
    }

    public function test_unauthenticated_user_cannot_logout(): void
    {
        $response = $this->postJson(self::LOGOUT_ENDPOINT);

        $response->assertUnauthorized();
    }

    public function test_logout_revokes_only_the_current_access_token(): void
    {
        $user = User::factory()->create();

        $currentToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $secondaryToken = $user
            ->createToken('secondary-device')
            ->plainTextToken;

        $this->assertSame(2, $user->tokens()->count());

        $response = $this
            ->withToken($currentToken)
            ->postJson(self::LOGOUT_ENDPOINT);

        $response->assertOk();

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

        $this
            ->withToken($secondaryToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertOk();
    }

    public function test_revoked_access_token_cannot_be_used_again(): void
    {
        $user = User::factory()->create();

        $accessToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $this
            ->withToken($accessToken)
            ->postJson(self::LOGOUT_ENDPOINT)
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
            'name' => 'current-device',
        ]);

        $this->app['auth']->forgetGuards();

        $this
            ->withToken($accessToken)
            ->getJson(self::ME_ENDPOINT)
            ->assertUnauthorized();
    }

    public function test_logout_does_not_revoke_another_users_access_tokens(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $currentToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $otherUserToken = $otherUser
            ->createToken('other-user-device')
            ->plainTextToken;

        $response = $this
            ->withToken($currentToken)
            ->postJson(self::LOGOUT_ENDPOINT);

        $response->assertOk();

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
            ->assertOk();
    }

    public function test_logout_response_does_not_expose_sensitive_information(): void
    {
        $user = User::factory()->create();

        $accessToken = $user
            ->createToken('current-device')
            ->plainTextToken;

        $response = $this
            ->withToken($accessToken)
            ->postJson(self::LOGOUT_ENDPOINT);

        $response
            ->assertOk()
            ->assertJsonMissingPath('data.password')
            ->assertJsonMissingPath('data.token')
            ->assertJsonMissingPath('data.user.password')
            ->assertJsonMissingPath('password')
            ->assertJsonMissingPath('token');
    }
}

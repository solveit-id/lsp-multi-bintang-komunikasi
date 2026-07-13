<?php

declare(strict_types=1);

namespace Tests\Feature\Modules\Authentication;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

final class LoginTest extends TestCase
{
    use RefreshDatabase;

    private const ENDPOINT = '/api/auth/login';

    private const EMAIL = 'testing.login.test@gmail.com';

    private const PASSWORD = 'Password123!';

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = $this->createUser();

        $response = $this->postJson(self::ENDPOINT, [
            'email' => $user->email,
            'password' => self::PASSWORD,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.user.uuid', $user->uuid)
            ->assertJsonPath('data.user.name', $user->name)
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
            ])
            ->assertJsonMissingPath('data.user.id')
            ->assertJsonMissingPath('data.user.password')
            ->assertJsonMissingPath('data.user.remember_token');

        $token = $response->json('data.token');

        $this->assertIsString($token);
        $this->assertNotSame('', $token);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->getKey(),
        ]);

        $this->assertSame(1, $user->tokens()->count());
    }

    public function test_email_is_required_to_login(): void
    {
        $response = $this->postJson(self::ENDPOINT, [
            'password' => self::PASSWORD,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_password_is_required_to_login(): void
    {
        $user = $this->createUser();

        $response = $this->postJson(self::ENDPOINT, [
            'email' => $user->email,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_email_must_have_a_valid_format(): void
    {
        $response = $this->postJson(self::ENDPOINT, [
            'email' => 'invalid-email-address',
            'password' => self::PASSWORD,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_user_cannot_login_with_an_incorrect_password(): void
    {
        $user = $this->createUser();

        $response = $this->postJson(self::ENDPOINT, [
            'email' => $user->email,
            'password' => 'IncorrectPassword123!',
        ]);

        $response->assertUnauthorized();

        $this->assertDatabaseCount('personal_access_tokens', 0);

        $user->refresh();

        $this->assertTrue(
            Hash::check(self::PASSWORD, $user->password),
        );
    }

    public function test_user_cannot_login_with_an_unknown_email(): void
    {
        $response = $this->postJson(self::ENDPOINT, [
            'email' => 'unknown.login.test@gmail.com',
            'password' => self::PASSWORD,
        ]);

        $response->assertUnauthorized();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_failed_login_responses_do_not_expose_sensitive_information(): void
    {
        $user = $this->createUser();

        $response = $this->postJson(self::ENDPOINT, [
            'email' => $user->email,
            'password' => 'IncorrectPassword123!',
        ]);

        $response
            ->assertUnauthorized()
            ->assertJsonMissingPath('data.password')
            ->assertJsonMissingPath('data.user.password')
            ->assertJsonMissingPath('data.token')
            ->assertJsonMissingPath('password')
            ->assertJsonMissingPath('token');
    }

    /**
     * Create a user with known authentication credentials.
     *
     * @param  array<string, mixed>  $attributes
     */
    private function createUser(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'name' => 'Testing User',
            'email' => self::EMAIL,
            'password' => Hash::make(self::PASSWORD),
        ], $attributes));
    }
}

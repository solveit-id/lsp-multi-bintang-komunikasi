<?php

declare(strict_types=1);

namespace App\Modules\Authentication\DTOs;

use App\Modules\Authentication\Requests\LoginRequest;

final readonly class LoginData
{
    public function __construct(
        public string $email,
        public string $password,
    ) {
    }

    /**
     * Membuat DTO dari LoginRequest yang telah tervalidasi.
     */
    public static function fromRequest(LoginRequest $request): self
    {
        /** @var array{
         *     email: string,
         *     password: string,
         * } $validated
         */
        $validated = $request->validated();

        return new self(
            email: $validated['email'],
            password: $validated['password'],
        );
    }

    /**
     * Mengubah DTO menjadi array.
     *
     * @return array{
     *     email: string,
     *     password: string,
     * }
     */
    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'password' => $this->password,
        ];
    }
}

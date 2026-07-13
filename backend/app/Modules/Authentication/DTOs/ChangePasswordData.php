<?php

declare(strict_types=1);

namespace App\Modules\Authentication\DTOs;

use App\Contracts\Data\ArrayableData;

final readonly class ChangePasswordData implements ArrayableData
{
    /**
     * Create a new change password data object.
     */
    public function __construct(
        public string $currentPassword,
        public string $password,
    ) {}

    /**
     * Create the DTO from validated request data.
     *
     * @param  array{
     *     current_password: string,
     *     password: string
     * }  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            currentPassword: $data['current_password'],
            password: $data['password'],
        );
    }

    /**
     * Convert the DTO into an array.
     *
     * @return array{
     *     current_password: string,
     *     password: string
     * }
     */
    public function toArray(): array
    {
        return [
            'current_password' => $this->currentPassword,
            'password' => $this->password,
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Authentication\DTOs;

use App\Contracts\Data\ArrayableData;

final readonly class UpdateProfileData implements ArrayableData
{
    /**
     * Create a new profile update data object.
     */
    public function __construct(
        public string $name,
        public string $email,
    ) {}

    /**
     * Create the DTO from validated profile data.
     *
     * @param  array{
     *     name: string,
     *     email: string
     * }  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
        );
    }

    /**
     * Convert the DTO into an array.
     *
     * @return array{
     *     name: string,
     *     email: string
     * }
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
        ];
    }
}

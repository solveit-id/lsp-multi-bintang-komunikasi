<?php

declare(strict_types=1);

namespace App\Modules\Authentication\DTOs;

use App\Contracts\Data\ArrayableData;
use App\Models\User;

final readonly class AuthenticatedUserData implements ArrayableData
{
    public function __construct(
        public string $uuid,
        public string $name,
        public string $email,
    ) {
    }

    public static function fromModel(User $user): self
    {
        return new self(
            uuid: $user->uuid,
            name: $user->name,
            email: $user->email,
        );
    }

    /**
     * @return array{
     *      uuid:string,
     *      name:string,
     *      email:string
     * }
    */
    public function toArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'email' => $this->email,
        ];
    }
}

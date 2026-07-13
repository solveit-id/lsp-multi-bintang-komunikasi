<?php

declare(strict_types=1);

namespace App\Modules\Authentication\DTOs;
use App\Contracts\Data\ArrayableData;

final readonly class LoginResponseData implements ArrayableData
{
    public function __construct(
        public string $token,
        public AuthenticatedUserData $user,
    ) {
    }

    /**
     * @return array{
     *     token:string,
     *     user:array{
     *          uuid:string,
     *          name:string,
     *          email:string
     *     }
     * }
     */
    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'user' => $this->user->toArray(),
        ];
    }
}

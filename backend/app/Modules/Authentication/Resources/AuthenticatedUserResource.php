<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Resources;

use App\Modules\Authentication\DTOs\AuthenticatedUserData;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AuthenticatedUserData
 */
final class AuthenticatedUserResource extends JsonResource
{
    /**
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        /** @var AuthenticatedUserData $user */
        $user = $this->resource;

        return [
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }
}

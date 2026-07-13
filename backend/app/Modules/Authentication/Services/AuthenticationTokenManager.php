<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Services;

use App\Models\User;
use App\Modules\Authentication\Constants\AuthenticationToken;
use App\Modules\Authentication\Contracts\AuthenticationTokenManagerInterface;
use Laravel\Sanctum\PersonalAccessToken;

final class AuthenticationTokenManager implements AuthenticationTokenManagerInterface
{
    public function create(User $user): string
    {
        return $user
            ->createToken(AuthenticationToken::WEB)
            ->plainTextToken;
    }

    private function current(User $user): ?PersonalAccessToken
    {
        /** @var PersonalAccessToken|null */
        return $user->currentAccessToken();
    }

    public function revokeCurrent(User $user): void
    {
        $this->current($user)?->delete();
    }

    public function revokeAll(User $user): void
    {
        $user->tokens()->delete();
    }
}

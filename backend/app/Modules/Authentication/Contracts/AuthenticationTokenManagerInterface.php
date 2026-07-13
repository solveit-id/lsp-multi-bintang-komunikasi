<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Contracts;

use App\Models\User;

interface AuthenticationTokenManagerInterface
{
    /**
     * Create a new personal access token.
     */
    public function create(User $user): string;

    /**
     * Revoke current access token.
     */
    public function revokeCurrent(User $user): void;

    /**
     * Revoke all personal access tokens.
     */
    public function revokeAll(User $user): void;
}

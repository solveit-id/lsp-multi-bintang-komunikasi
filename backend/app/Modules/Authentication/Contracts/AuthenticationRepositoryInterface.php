<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Contracts;

use App\Models\User;

interface AuthenticationRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function findByUuid(string $uuid): ?User;

    public function findForAuthentication(string $email): ?User;

    public function updateProfile(User $user, array $attributes): User;

    public function updatePassword(User $user, string $hashedPassword): User;
}

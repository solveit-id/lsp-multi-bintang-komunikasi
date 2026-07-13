<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Contracts;

use App\Models\User;
use App\Modules\Authentication\DTOs\AuthenticatedUserData;
use App\Modules\Authentication\DTOs\ChangePasswordData;
use App\Modules\Authentication\DTOs\LoginData;
use App\Modules\Authentication\DTOs\LoginResponseData;
use App\Modules\Authentication\DTOs\UpdateProfileData;

interface AuthenticationServiceInterface
{
    public function currentUser(): AuthenticatedUserData;

    public function login(LoginData $data): LoginResponseData;

    public function logout(User $user): void;

    public function logoutAll(User $user): void;

    public function me(User $user): AuthenticatedUserData;

    public function updateProfile(User $user, UpdateProfileData $data): AuthenticatedUserData;

    public function changePassword(User $user, ChangePasswordData $data): void;
}

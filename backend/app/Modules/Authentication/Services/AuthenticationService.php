<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Services;

use App\Models\User;
use App\Modules\Authentication\Contracts\AuthenticationRepositoryInterface;
use App\Modules\Authentication\Contracts\AuthenticationServiceInterface;
use App\Modules\Authentication\Contracts\AuthenticationTokenManagerInterface;
use App\Modules\Authentication\DTOs\AuthenticatedUserData;
use App\Modules\Authentication\DTOs\ChangePasswordData;
use App\Modules\Authentication\DTOs\LoginData;
use App\Modules\Authentication\DTOs\LoginResponseData;
use App\Modules\Authentication\DTOs\UpdateProfileData;
use App\Modules\Authentication\Exceptions\InvalidCredentialsException;
use App\Services\BaseService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

final class AuthenticationService extends BaseService implements AuthenticationServiceInterface
{
    public function __construct(
        private readonly AuthenticationRepositoryInterface $repository,
        private readonly AuthenticationTokenManagerInterface $tokenManager,
    ) {}

    public function currentUser(): AuthenticatedUserData
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (! $user instanceof User) {
            throw new RuntimeException('Authenticated user not found.');
        }

        return new AuthenticatedUserData(
            uuid: $user->uuid,
            name: $user->name,
            email: $user->email,
        );
    }

    public function login(LoginData $data): LoginResponseData
    {
        $user = $this->repository->findForAuthentication($data->email);

        if (! $user instanceof User) {
            throw new InvalidCredentialsException;
        }

        if (! Hash::check($data->password, $user->password)) {
            throw new InvalidCredentialsException;
        }

        $plainTextToken = $this->tokenManager->create($user);

        return new LoginResponseData(
            token: $plainTextToken,
            user: new AuthenticatedUserData(
                uuid: $user->uuid,
                name: $user->name,
                email: $user->email,
            ),
        );
    }

    public function logout(User $user): void
    {
        $this->tokenManager->revokeCurrent($user);
    }

    public function logoutAll(User $user): void
    {
        $this->tokenManager->revokeAll($user);
    }

    public function me(User $user): AuthenticatedUserData
    {
        return AuthenticatedUserData::fromModel($user);
    }

    public function updateProfile(
        User $user,
        UpdateProfileData $data,
    ): AuthenticatedUserData {
        $updatedUser = $this->repository->updateProfile(
            $user,
            $data->toArray(),
        );

        return $this->me($updatedUser);
    }

    public function changePassword(
        User $user,
        ChangePasswordData $data,
    ): void {
        if (! Hash::check($data->currentPassword, $user->password)) {
            throw new InvalidCredentialsException;
        }

        $hashedPassword = Hash::make($data->password);

        $this->repository->updatePassword(
            $user,
            $hashedPassword,
        );

        $this->tokenManager->revokeAll($user);
    }
}

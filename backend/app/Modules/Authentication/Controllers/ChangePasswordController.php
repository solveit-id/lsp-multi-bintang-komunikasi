<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Controllers;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\User;
use App\Modules\Authentication\Contracts\AuthenticationServiceInterface;
use App\Modules\Authentication\DTOs\ChangePasswordData;
use App\Modules\Authentication\Requests\ChangePasswordRequest;
use Illuminate\Http\JsonResponse;

final class ChangePasswordController extends BaseApiController
{
    /**
     * Create a new change password controller instance.
     */
    public function __construct(
        private readonly AuthenticationServiceInterface $authenticationService,
    ) {}

    /**
     * Change the authenticated user's password.
     */
    public function __invoke(ChangePasswordRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $data = ChangePasswordData::fromArray(
            $request->validated(),
        );

        $this->authenticationService->changePassword(
            $user,
            $data,
        );

        return $this->success(
            data: null,
            message: 'Password changed successfully. Please log in again.',
        );
    }
}

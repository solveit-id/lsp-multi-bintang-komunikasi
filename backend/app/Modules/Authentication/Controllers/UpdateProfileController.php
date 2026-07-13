<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Controllers;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\User;
use App\Modules\Authentication\Contracts\AuthenticationServiceInterface;
use App\Modules\Authentication\DTOs\UpdateProfileData;
use App\Modules\Authentication\Requests\UpdateProfileRequest;
use App\Modules\Authentication\Resources\AuthenticatedUserResource;
use Illuminate\Http\JsonResponse;

final class UpdateProfileController extends BaseApiController
{
    /**
     * Create a new update profile controller instance.
     */
    public function __construct(
        private readonly AuthenticationServiceInterface $authenticationService,
    ) {}

    /**
     * Update the authenticated user's profile.
     */
    public function __invoke(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        if (! $user instanceof User) {
            abort(401);
        }

        $data = UpdateProfileData::fromArray(
            $request->validated(),
        );

        $profile = $this->authenticationService->updateProfile(
            $user,
            $data,
        );

        return $this->success(
            data: new AuthenticatedUserResource($profile),
            message: 'Profile updated successfully.',
        );
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Controllers;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\User;
use App\Modules\Authentication\Contracts\AuthenticationServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MeController extends BaseApiController
{
    public function __construct(
        private readonly AuthenticationServiceInterface $authenticationService,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $authenticatedUser = $this->authenticationService->me($user);

        return $this->success(
            data: $authenticatedUser,
            message: 'Authenticated user retrieved successfully.',
        );
    }
}

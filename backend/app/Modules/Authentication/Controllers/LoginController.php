<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Controllers;

use App\Http\Controllers\Api\BaseApiController;
use App\Modules\Authentication\Contracts\AuthenticationServiceInterface;
use App\Modules\Authentication\DTOs\LoginData;
use App\Modules\Authentication\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class LoginController extends BaseApiController
{
    public function __construct(
        private readonly AuthenticationServiceInterface $authenticationService,
    ) {
    }

    /**
     * Login pengguna.
     */
    public function __invoke(LoginRequest $request): JsonResponse
    {
        $response = $this->authenticationService->login(
            LoginData::fromRequest($request)
        );

        return $this->success(
            data: $response->toArray(),
            message: 'Login successful.',
            status: Response::HTTP_OK,
        );
    }
}

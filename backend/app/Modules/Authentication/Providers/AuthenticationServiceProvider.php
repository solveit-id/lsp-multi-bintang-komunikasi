<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Providers;

use App\Modules\Authentication\Contracts\AuthenticationRepositoryInterface;
use App\Modules\Authentication\Contracts\AuthenticationServiceInterface;
use App\Modules\Authentication\Contracts\AuthenticationTokenManagerInterface;
use App\Modules\Authentication\Services\AuthenticationTokenManager;
use App\Modules\Authentication\Repositories\AuthenticationRepository;
use App\Modules\Authentication\Services\AuthenticationService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

final class AuthenticationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            AuthenticationRepositoryInterface::class,
            AuthenticationRepository::class,
        );

        $this->app->bind(
            AuthenticationTokenManagerInterface::class,
            AuthenticationTokenManager::class,
        );

        $this->app->bind(
            AuthenticationServiceInterface::class,
            AuthenticationService::class,
        );
    }

    public function boot(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->group(__DIR__ . '/../Routes/api.php');
    }
}

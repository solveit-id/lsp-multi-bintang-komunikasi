<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Repositories;

use App\Models\User;
use App\Modules\Authentication\Contracts\AuthenticationRepositoryInterface;
use App\Repositories\Eloquent\BaseRepository;
use Illuminate\Database\Eloquent\Builder;

final class AuthenticationRepository extends BaseRepository implements AuthenticationRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * @return Builder<User>
     */
    private function query(): Builder
    {
        /** @var Builder<User> $query */
        $query = $this->model->newQuery();

        return $query;
    }

    public function findByEmail(string $email): ?User
    {
        /** @var User|null */
        return $this->query()
            ->where('email', $email)
            ->first();
    }

    public function findByUuid(string $uuid): ?User
    {
        /** @var User|null */
        return $this->query()
            ->uuid($uuid)
            ->first();
    }

    public function findForAuthentication(string $email): ?User
    {
        /** @var User|null */
        return $this->query()
            ->where('email', $email)
            ->first();
    }

    public function updateProfile(
        User $user,
        array $attributes,
    ): User {
        $user->fill($attributes);
        $user->save();
        $user->refresh();

        return $user;
    }

    public function updatePassword(
        User $user,
        string $hashedPassword,
    ): User {
        $user->forceFill([
            'password' => $hashedPassword,
        ]);

        $user->save();
        $user->refresh();

        return $user;
    }
}

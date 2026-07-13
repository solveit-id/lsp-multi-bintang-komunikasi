<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements BaseRepositoryInterface
{
    public function __construct(
        protected Model $model
    ) {
    }

    public function all(): Collection
    {
        return $this->model->newQuery()->get();
    }

    public function paginate(
        int $perPage = 15
    ): LengthAwarePaginator {
        return $this->model
            ->newQuery()
            ->paginate($perPage);
    }

    public function findByUuid(
        string $uuid
    ): ?Model {
        return $this->model
            ->newQuery()
            ->where('uuid', $uuid)
            ->first();
    }

    public function create(
        array $attributes
    ): Model {
        return $this->model
            ->create($attributes);
    }

    public function update(
        Model $model,
        array $attributes
    ): bool {
        return $model->update($attributes);
    }

    public function delete(
        Model $model
    ): bool {
        return (bool) $model->delete();
    }
}

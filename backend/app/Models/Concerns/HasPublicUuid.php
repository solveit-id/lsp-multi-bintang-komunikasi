<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

trait HasPublicUuid
{
    use HasUuids;

    /**
     * UUID digunakan sebagai route model binding.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Menghasilkan UUID v7.
     */
    public function newUniqueId(): string
    {
        return (string) Str::uuid7();
    }

    /**
     * Kolom UUID yang akan diisi otomatis.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * Scope pencarian berdasarkan UUID.
     */
    public function scopeUuid(Builder $query, string $uuid): Builder
    {
        return $query->where('uuid', $uuid);
    }
}

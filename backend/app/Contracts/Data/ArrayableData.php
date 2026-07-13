<?php

declare(strict_types=1);

namespace App\Contracts\Data;

/**
 * Kontrak dasar seluruh DTO aplikasi.
 */
interface ArrayableData
{
    /**
     * Mengubah DTO menjadi array.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array;
}

<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Throwable;

abstract class BaseService
{
    /**
     * Jalankan business process di dalam database transaction.
     *
     * @template TReturn
     *
     * @param callable(): TReturn $callback
     *
     * @return TReturn
     *
     * @throws Throwable
     */
    protected function transaction(callable $callback, int $attempts = 1): mixed
    {
        return DB::transaction($callback, $attempts);
    }
}

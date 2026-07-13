<?php

declare(strict_types=1);

namespace App\Logging\Context;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class RequestContext
{
    public static function make(Request $request): array
    {
        return [
            'request_id' => (string) Str::uuid7(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_uuid' => Auth::user()?->uuid,
        ];
    }
}

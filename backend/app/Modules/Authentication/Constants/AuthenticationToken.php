<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Constants;

final class AuthenticationToken
{
    /**
     * Token untuk aplikasi web.
     */
    public const WEB = 'web';

    /**
     * Token untuk aplikasi mobile.
     */
    public const MOBILE = 'mobile';

    /**
     * Token untuk integrasi API eksternal.
     */
    public const API = 'api';

    private function __construct()
    {
    }
}

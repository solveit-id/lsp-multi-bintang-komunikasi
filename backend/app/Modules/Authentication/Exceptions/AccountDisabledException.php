<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Exceptions;

final class AccountDisabledException extends AuthenticationException
{
    public function __construct()
    {
        parent::__construct('Your account has been disabled.');
    }
}

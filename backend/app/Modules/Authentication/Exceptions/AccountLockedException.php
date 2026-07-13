<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Exceptions;

final class AccountLockedException extends AuthenticationException
{
    public function __construct()
    {
        parent::__construct('Your account is temporarily locked.');
    }
}

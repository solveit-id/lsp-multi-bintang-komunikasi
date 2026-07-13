<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Exceptions;

final class PasswordExpiredException extends AuthenticationException
{
    public function __construct()
    {
        parent::__construct('Your password has expired.');
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Exceptions;

final class InvalidCredentialsException extends AuthenticationException
{
    public function __construct()
    {
        parent::__construct('Invalid credentials.');
    }
}

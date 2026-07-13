<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Exceptions;

final class EmailNotVerifiedException extends AuthenticationException
{
    public function __construct()
    {
        parent::__construct('Your email address has not been verified.');
    }
}

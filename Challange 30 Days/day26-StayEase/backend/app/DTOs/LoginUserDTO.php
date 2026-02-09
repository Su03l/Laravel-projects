<?php

namespace App\DTOs;

use Illuminate\Http\Request;

class LoginUserDTO
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly bool   $remember = false,
    )
    {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            email: $request->string('email'),
            password: $request->string('password'),
            remember: $request->boolean('rememberMe'),
        );
    }
}

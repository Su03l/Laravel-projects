<?php

namespace App\DTOs;

use Illuminate\Http\Request;

class LoginUserDTO
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly bool $remember_me = false, // 👈 الجديد
    )
    {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            email: $request->input('email'),
            password: $request->input('password'),
            remember_me: $request->boolean('remember_me'), // لارافيل يحول on/true/1 لـ boolean
        );
    }
}

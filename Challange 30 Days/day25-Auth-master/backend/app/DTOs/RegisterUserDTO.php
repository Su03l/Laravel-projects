<?php

namespace App\DTOs;

use Illuminate\Http\Request;

class RegisterUserDTO
{
    public function __construct(
        public readonly string  $name,
        public readonly string  $email,
        public readonly string  $password,
        public readonly ?string $phone = null,
        public readonly string  $role = 'user', // نقدر نغيرها لو الأدمن هو اللي يضيف
    )
    {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->input('name'),
            email: $request->input('email'),
            password: $request->input('password'),
            phone: $request->input('phone'),
            role: $request->input('role') ?? 'user', // لو ما حددنا، يصير يوزر
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'phone' => $this->phone,
            'role' => $this->role,
        ];
    }
}

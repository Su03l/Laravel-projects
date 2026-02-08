<?php

namespace App\DTOs;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class UpdateProfileDTO
{
    public function __construct(
        public readonly ?string $name,
        public readonly ?string $email,
        public readonly ?string $phone,
        public readonly ?UploadedFile $avatar = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->input('name'),
            email: $request->input('email'),
            phone: $request->input('phone'),
            avatar: $request->file('avatar'),
        );
    }
}

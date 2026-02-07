<?php

namespace App\DTOs;

use Illuminate\Http\UploadedFile;

class UpdateProfileDTO
{
    public function __construct(
        public readonly ?string       $name,
        public readonly ?string       $phone,
        public readonly ?UploadedFile $avatar = null, //  نستقبل ملف
    ) {}

    public static function fromRequest($request): self
    {
        return new self(
            name: $request->input('name'),
            phone: $request->input('phone'),
            avatar: $request->file('avatar'), //  استقبال الصورة
        );
    }
}

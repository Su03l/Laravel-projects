<?php
namespace App\DTOs;

use Illuminate\Http\Request;

class ResetPasswordDTO {
    public function __construct(
        public readonly string $email,
        public readonly string $otp_code,
        public readonly string $password
    ) {}

    public static function fromRequest(Request $request): self {
        return new self(
            email: $request->input('email'),
            otp_code: $request->input('otp_code'),
            password: $request->input('password')
        );
    }
}

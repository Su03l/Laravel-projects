<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponse;
use App\Services\OtpService;
use App\DTOs\RegisterUserDTO;
use App\Actions\Auth\RegisterUserAction;
use App\Mail\WelcomeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(protected OtpService $otpService) {}

    // Register User
    public function register(RegisterRequest $request, RegisterUserAction $action)
    {
        $dto = RegisterUserDTO::fromRequest($request);
        $action->execute($dto);

        return $this->success(null, 'Account created. Please check your email for the OTP code.', 201);
    }

    // Verify Account user
    public function verifyAccount(Request $request)
    {
        $request->validate(['email' => 'required|email', 'otp' => 'required']);

        $user = User::where('email', $request->email)->first();

        if (!$user || !$this->otpService->verifyOtp($user, $request->otp)) {
            return $this->error('Invalid or expired OTP.', 400);
        }

        Mail::to($user->email)->send(new WelcomeMail($user));
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Account verified successfully.');
    }

    // Login User
    public function login(Request $request)
    {
        $request->validate(['email' => 'required|email', 'password' => 'required']);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->error('Invalid credentials.', 401);
        }

        if (!$user->email_verified_at) {
            $this->otpService->sendOtp($user, 'Verification');
            return $this->error('Account not verified. OTP sent.', 403, ['action' => 'verify']);
        }

        if ($user->two_factor_enabled) {
            $this->otpService->sendOtp($user, 'Login 2FA');
            return $this->success(['require_otp' => true], 'OTP sent to your email.');
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Login successful.');
    }

    // Login Verify User
    public function loginVerify(Request $request)
    {
        $request->validate(['email' => 'required|email', 'otp' => 'required']);
        $user = User::where('email', $request->email)->first();

        if (!$user || !$this->otpService->verifyOtp($user, $request->otp)) {
            return $this->error('Invalid or expired OTP.', 400);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Login successful.');
    }

    // Forgot Password
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);
        $user = User::where('email', $request->email)->first();

        $this->otpService->sendOtp($user, 'Password Reset');
        return $this->success(null, 'Password reset OTP sent.');
    }

    // Reset Password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$this->otpService->verifyOtp($user, $request->otp)) {
            return $this->error('Invalid or expired OTP.', 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return $this->success(null, 'Password reset successfully. You can now login.');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Logged out successfully.');
    }
}

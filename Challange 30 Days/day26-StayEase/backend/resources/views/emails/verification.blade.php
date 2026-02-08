@extends('emails.layout')

@section('content')
    <h2>تفعيل الحساب</h2>
    <p>مرحباً {{ $user->name }}،</p>
    <p>أهلاً بك في عائلة StayEase!</p>
    <p>لتفعيل حسابك والبدء في حجز إقامتك، يرجى استخدام الرمز التالي:</p>

    <div class="code-box">{{ $code }}</div>

    <p>هذا الرمز صالح لمدة 10 دقائق.</p>
@endsection

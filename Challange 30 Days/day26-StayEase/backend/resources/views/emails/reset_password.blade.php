@extends('emails.layout')

@section('content')
    <h2>استعادة كلمة المرور</h2>
    <p>مرحباً {{ $user->name }}،</p>
    <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
    <p>استخدم الرمز التالي لإتمام العملية:</p>

    <div class="code-box">{{ $code }}</div>

    <p>لا تشارك هذا الرمز مع أي شخص.</p>
@endsection

@extends('emails.layout')

@section('content')
    <h2>تسجيل دخول جديد</h2>
    <p>لقد تم طلب تسجيل الدخول إلى حسابك.</p>
    <p>يرجى استخدام رمز التحقق أدناه لإكمال العملية:</p>

    <div class="code-box">{{ $code }}</div>

    <p class="alert">إذا لم تقم بطلب هذا الرمز، يرجى تغيير كلمة المرور فوراً لحماية حسابك.</p>
@endsection

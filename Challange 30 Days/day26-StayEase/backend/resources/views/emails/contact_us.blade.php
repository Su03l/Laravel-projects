@extends('emails.layout')

@section('content')
    <h2>رسالة جديدة من نموذج "اتصل بنا"</h2>
    <div style="text-align: right; margin-top: 30px;">
        <p><strong>الاسم:</strong> {{ $data['name'] }}</p>
        <p><strong>البريد الإلكتروني:</strong> {{ $data['email'] }}</p>
        <p><strong>الموضوع:</strong> {{ $data['subject'] }}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p><strong>الرسالة:</strong></p>
        <p style="background-color: #f8fafc; padding: 15px; border-radius: 4px;">{{ $data['message'] }}</p>
    </div>
@endsection

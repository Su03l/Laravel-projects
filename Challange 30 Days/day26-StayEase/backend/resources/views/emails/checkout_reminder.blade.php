@extends('emails.layout')

@section('content')
    <h2>تذكير بموعد المغادرة</h2>
    <p>مرحباً {{ $booking->user->name }}،</p>
    <p>نود تذكيرك بأن موعد مغادرتك هو غداً الموافق {{ $booking->check_out->format('Y-m-d') }}.</p>
    <p>نتمنى لك رحلة آمنة ونأمل أن تكون قد استمتعت بإقامتك معنا.</p>

    <div class="alert" style="color: #4f46e5; border-color: #4f46e5; background-color: #eef2ff;">
        يرجى تسليم المفتاح عند الاستقبال قبل الساعة 12:00 ظهراً.
    </div>
@endsection

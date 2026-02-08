@extends('emails.layout')

@section('content')
    <h2>مرحباً {{ $name }}!</h2>
    <p>تم تفعيل حسابك بنجاح.</p>
    <p>نحن سعداء جداً بانضمامك إلينا. يمكنك الآن استكشاف أفخم الغرف والأجنحة وحجز إقامتك بكل سهولة.</p>

    <a href="{{ env('FRONTEND_URL', '#') }}" class="btn">تصفح الغرف الآن</a>
@endsection

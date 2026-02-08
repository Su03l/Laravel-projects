@extends('emails.layout')

@section('content')
    <h2>شكراً لزيارتك!</h2>
    <p>مرحباً {{ $booking->user->name }}،</p>
    <p>لقد سعدنا جداً باستضافتك في StayEase.</p>
    <p>نود معرفة رأيك لنتحسن مستقبلاً. هل يمكنك منحنا دقيقة لتقييم الغرفة؟</p>

    <a href="{{ env('FRONTEND_URL') }}/reviews/create?booking_id={{ $booking->id }}" class="btn" style="background: #fbbf24; color: black;">
       قيم إقامتك الآن
    </a>
@endsection

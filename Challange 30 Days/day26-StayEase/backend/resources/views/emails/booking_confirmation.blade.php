<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <style>
        body { font-family: sans-serif; background: #f9fafb; padding: 20px; }
        .invoice-box { max-width: 600px; margin: auto; background: white; padding: 30px; border: 1px solid #eee; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 20px; }
        .details { margin-bottom: 20px; }
        .total { font-size: 24px; font-weight: bold; color: #4f46e5; text-align: left; margin-top: 20px; border-top: 2px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <h1>تم تأكيد الحجز!</h1>
            <p>شكراً لاختيارك StayEase لإقامتك.</p>
        </div>

        <div class="details">
            <p><strong>الاسم:</strong> {{ $booking->user->name }}</p>
            <p><strong>رقم الحجز:</strong> #{{ $booking->id }}</p>
            <p><strong>الغرفة:</strong> {{ $booking->room->type }} - {{ $booking->room->view }} ({{ $booking->room->room_number }})</p>
            <p><strong>الباقة:</strong> {{ $booking->package->name }}</p>
            <hr>
            <p><strong>تاريخ الوصول:</strong> {{ $booking->check_in->format('Y-m-d') }}</p>
            <p><strong>تاريخ المغادرة:</strong> {{ $booking->check_out->format('Y-m-d') }}</p>
        </div>

        <div class="total">
            الإجمالي: {{ number_format($booking->total_price, 2) }} ر.س
        </div>

        <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
            سياسة الإلغاء: مجاناً قبل 48 ساعة من الوصول.
        </p>
    </div>
</body>
</html>

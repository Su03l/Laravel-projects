@php
    $arabic = null;
    if (class_exists('\ArPHP\I18N\Arabic')) {
        $arabic = new \ArPHP\I18N\Arabic('Glyphs');
    } elseif (class_exists('\I18N_Arabic')) {
        $arabic = new \I18N_Arabic('Glyphs');
    }

    $fix = function($text) use ($arabic) {
        if (!$arabic || empty($text)) return $text;
        $reshaped = $arabic->utf8Glyphs($text);
        // قلب النص ليتناسب مع RTL في dompdf
        return implode('', array_reverse(preg_split('//u', $reshaped, -1, PREG_SPLIT_NO_EMPTY)));
    };
@endphp
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            padding: 20px;
            color: #333;
            direction: rtl;
            text-align: right;
        }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .logo { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .invoice-box { max-width: 800px; margin: auto; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 5px; text-align: right; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .details-table th, .details-table td { border: 1px solid #ddd; padding: 12px; text-align: right; }
        .details-table th { background-color: #f8f9fa; color: #333; }
        .total-box { margin-top: 30px; text-align: right; }
        .total-amount { font-size: 20px; font-weight: bold; color: #27ae60; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
        .badge-income { color: green; font-weight: bold; }
        .badge-expense { color: red; font-weight: bold; }
    </style>
</head>
<body>
<div class="invoice-box">
    <div class="header">
        <div class="logo">{{ $fix('شركة الحلول المتقدمة') }}</div>
        <p>{{ $fix('فاتورة ضريبية مبسطة') }}</p>
    </div>

    <table class="info-table">
        <tr>
            <td><strong>{{ $fix('رقم الفاتورة:') }}</strong> #{{ $t->id }}</td>
            <td><strong>{{ $fix('التاريخ:') }}</strong> {{ $t->date }}</td>
        </tr>
        <tr>
            <td><strong>{{ $fix('الجهة:') }}</strong> {{ $t->company_name }}</td>
            <td><strong>{{ $fix('الموظف المسؤول:') }}</strong> {{ $t->user->name }}</td>
        </tr>
    </table>

    <table class="details-table">
        <thead>
        <tr>
            <th>{{ $fix('الوصف') }}</th>
            <th>{{ $fix('النوع') }}</th>
            <th>{{ $fix('المبلغ') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>{{ $t->title }}</td>
            <td>
                <span class="{{ $t->type == 'income' ? 'badge-income' : 'badge-expense' }}">
                    {{ $t->type == 'income' ? $fix('إيراد (قبض)') : $fix('مصروف (صرف)') }}
                </span>
            </td>
            <td>{{ number_format($t->amount, 2) }} {{ $fix('ر.س') }}</td>
        </tr>
        </tbody>
    </table>

    <div class="total-box">
        <p>{{ $fix('المبلغ الإجمالي:') }}</p>
        <div class="total-amount">{{ number_format($t->amount, 2) }} {{ $fix('ريال سعودي') }}</div>
    </div>

    <div class="footer">
        {{ $fix('تم إصدار هذه الفاتورة إلكترونياً من نظام ERP الخاص بالشركة.') }}
    </div>
</div>
</body>
</html>

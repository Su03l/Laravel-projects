<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        /* إعدادات الخط لدعم العربية في PDF */
        body {
            font-family: 'DejaVu Sans', sans-serif;
            padding: 20px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }

        .invoice-box {
            max-width: 800px;
            margin: auto;
        }

        .info-table {
            width: 100%;
            margin-bottom: 20px;
        }

        .info-table td {
            padding: 5px;
        }

        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .details-table th, .details-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: right;
        }

        .details-table th {
            background-color: #f8f9fa;
            color: #333;
        }

        .total-box {
            margin-top: 30px;
            text-align: left;
        }

        .total-amount {
            font-size: 20px;
            font-weight: bold;
            color: #27ae60;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }

        /* تلوين النوع */
        .badge-income {
            color: green;
            font-weight: bold;
        }

        .badge-expense {
            color: red;
            font-weight: bold;
        }
    </style>
</head>
<body>
<div class="invoice-box">
    <div class="header">
        <div class="logo">شركة الحلول المتقدمة</div>
        <p>فاتورة ضريبية مبسطة</p>
    </div>

    <table class="info-table">
        <tr>
            <td><strong>رقم الفاتورة:</strong> #{{ $t->id }}</td>
            <td><strong>التاريخ:</strong> {{ $t->date }}</td>
        </tr>
        <tr>
            <td><strong>الجهة:</strong> {{ $t->company_name }}</td>
            <td><strong>الموظف المسؤول:</strong> {{ $t->user->name }}</td>
        </tr>
    </table>

    <table class="details-table">
        <thead>
        <tr>
            <th>الوصف</th>
            <th>النوع</th>
            <th>المبلغ</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>{{ $t->title }}</td>
            <td>
                        <span class="{{ $t->type == 'income' ? 'badge-income' : 'badge-expense' }}">
                            {{ $t->type == 'income' ? 'إيراد (قبض)' : 'مصروف (صرف)' }}
                        </span>
            </td>
            <td>{{ number_format($t->amount, 2) }} ر.س</td>
        </tr>
        </tbody>
    </table>

    <div class="total-box">
        <p>المبلغ الإجمالي:</p>
        <div class="total-amount">{{ number_format($t->amount, 2) }} ريال سعودي</div>
    </div>

    <div class="footer">
        تم إصدار هذه الفاتورة إلكترونياً من نظام ERP الخاص بالشركة.
    </div>
</div>
</body>
</html>

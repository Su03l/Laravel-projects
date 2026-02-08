<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StayEase Notification</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; line-height: 1.6; color: #374151; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: #4f46e5; padding: 30px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px 30px; text-align: center; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .btn { display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .code-box { background-color: #eef2ff; border: 2px dashed #c7d2fe; color: #4f46e5; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px; margin: 20px 0; border-radius: 8px; display: inline-block; }
        .alert { color: #ef4444; font-size: 13px; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- الهيدر الموحد -->
        <div class="header">
            <h1>StayEase</h1>
        </div>

        <!-- محتوى الرسالة المتغير -->
        <div class="content">
            @yield('content')
        </div>

        <!-- الفوتر الموحد -->
        <div class="footer">
            <p>&copy; {{ date('Y') }} StayEase Hotels. جميع الحقوق محفوظة.</p>
            <p>هذه رسالة آلية، يرجى عدم الرد عليها.</p>
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StayEase Notification</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #0f172a;
            --accent: #3b82f6;
            --bg: #f1f5f9;
            --text: #334155;
            --text-light: #64748b;
        }
        body {
            font-family: 'IBM Plex Sans Arabic', sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            color: #334155;
        }
        .wrapper {
            width: 100%;
            background-color: #f1f5f9;
            padding: 60px 0;
        }
        .container {
            max-width: 540px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 0;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .header {
            background-color: #0f172a;
            padding: 40px;
            text-align: center;
            border-bottom: 4px solid #3b82f6;
        }
        .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .content {
            padding: 50px 40px;
            text-align: center;
        }
        .content h2 {
            color: #0f172a;
            font-size: 28px;
            margin-bottom: 24px;
            font-weight: 700;
            line-height: 1.2;
        }
        .content p {
            font-size: 16px;
            color: #475569;
            margin-bottom: 24px;
            line-height: 1.6;
        }
        .code-box {
            background-color: #f8fafc;
            color: #0f172a;
            font-size: 42px;
            font-weight: 700;
            letter-spacing: 12px;
            padding: 24px;
            margin: 40px 0;
            border: 2px solid #e2e8f0;
            display: inline-block;
            min-width: 240px;
        }
        .btn {
            display: inline-block;
            background-color: #0f172a;
            color: #ffffff;
            padding: 16px 40px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 30px;
            font-size: 14px;
            letter-spacing: 0.5px;
            transition: all 0.2s ease;
        }
        .btn:hover {
            background-color: #3b82f6;
            transform: translateY(-2px);
        }
        .alert {
            color: #b91c1c;
            font-size: 14px;
            margin-top: 30px;
            background-color: #fef2f2;
            padding: 16px;
            border-left: 4px solid #ef4444;
            text-align: right;
        }
        .footer {
            background-color: #f8fafc;
            padding: 40px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 8px 0;
        }
        .footer strong {
            color: #64748b;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <!-- الهيدر القوي -->
            <div class="header">
                <h1>StayEase</h1>
            </div>

            <!-- محتوى الرسالة -->
            <div class="content">
                @yield('content')
            </div>

            <!-- الفوتر البسيط -->
            <div class="footer">
                <p>&copy; {{ date('Y') }} <strong>StayEase Hotels</strong>. جميع الحقوق محفوظة.</p>
                <p>هذه رسالة آلية، يرجى عدم الرد عليها.</p>
            </div>
        </div>
    </div>
</body>
</html>

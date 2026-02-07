<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>رمز التحقق</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700&display=swap');

        body {
            font-family: 'Alexandria', sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        .wrapper {
            width: 100%;
            background-color: #f3f4f6;
            padding: 40px 0;
        }

        .container {
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
        }

        .brand-bar {
            height: 6px;
            background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
            width: 100%;
        }

        .header {
            padding: 40px 40px 20px;
            text-align: center;
        }

        .logo-text {
            font-size: 24px;
            font-weight: 800;
            color: #1f2937;
            letter-spacing: -0.5px;
            margin: 0;
        }

        .content {
            padding: 20px 40px 40px;
            text-align: center;
        }

        h1 {
            color: #111827;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 12px;
        }

        p {
            color: #6b7280;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .otp-container {
            background: #f9fafb;
            border: 2px dashed #e5e7eb;
            border-radius: 16px;
            padding: 25px;
            margin: 0 auto 30px;
            position: relative;
        }

        .otp-code {
            font-family: 'Courier New', monospace;
            font-size: 38px;
            font-weight: 800;
            color: #4f46e5;
            letter-spacing: 12px;
            display: block;
            text-align: center;
        }

        .timer-badge {
            display: inline-block;
            background-color: #fee2e2;
            color: #991b1b;
            font-size: 12px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 20px;
            margin-top: 15px;
        }

        .divider {
            height: 1px;
            background-color: #f3f4f6;
            margin: 30px 0;
        }

        .footer {
            background-color: #f9fafb;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #f3f4f6;
        }

        .footer-text {
            font-size: 12px;
            color: #9ca3af;
            margin-bottom: 10px;
        }

        .social-links {
            margin-top: 15px;
        }

        .social-link {
            display: inline-block;
            width: 32px;
            height: 32px;
            background-color: #e5e7eb;
            border-radius: 50%;
            margin: 0 5px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="brand-bar"></div>

            <div class="header">
                <div class="logo-text">AuthMaster</div>
            </div>

            <div class="content">
                <h1>تأكيد الدخول</h1>
                <p>مرحباً بك، لإكمال عملية تسجيل الدخول وتأمين حسابك، يرجى استخدام رمز التحقق أدناه.</p>

                <div class="otp-container">
                    <span class="otp-code">{{ $otpCode }}</span>
                </div>

                <div class="timer-badge">
                    ⏳ صالح لمدة 10 دقائق
                </div>

                <div class="divider"></div>

                <p style="font-size: 13px; margin-bottom: 0;">
                    إذا لم تقم بطلب هذا الرمز، يرجى تجاهل هذه الرسالة أو التواصل مع الدعم الفني فوراً.
                </p>
            </div>

            <div class="footer">
                <div class="footer-text">&copy; {{ date('Y') }} AuthMaster Inc. جميع الحقوق محفوظة.</div>
                <div class="footer-text">تم الإرسال تلقائياً بواسطة النظام الآمن.</div>
            </div>
        </div>
    </div>
</body>
</html>

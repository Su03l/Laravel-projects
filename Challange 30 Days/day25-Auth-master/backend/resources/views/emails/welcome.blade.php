<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>أهلاً بك</title>
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
            background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
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

        .welcome-icon {
            font-size: 48px;
            margin-bottom: 20px;
            display: inline-block;
            animation: wave 2s infinite;
        }

        @keyframes wave {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(14deg); }
            20% { transform: rotate(-8deg); }
            30% { transform: rotate(14deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(10deg); }
            60% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
        }

        h1 {
            color: #111827;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 12px;
        }

        p {
            color: #6b7280;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            transition: transform 0.2s;
        }

        .features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 40px;
            text-align: right;
        }

        .feature-card {
            background: #f9fafb;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid #f3f4f6;
        }

        .feature-title {
            font-weight: 700;
            color: #374151;
            font-size: 13px;
            margin-bottom: 5px;
            display: block;
        }

        .feature-desc {
            font-size: 11px;
            color: #9ca3af;
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
                <div class="welcome-icon">👋</div>
                <h1>أهلاً بك، {{ $user->name }}!</h1>
                <p>سعداء جداً بانضمامك إلينا. تم تفعيل حسابك بنجاح وأصبحت الآن جاهزاً لاستكشاف كل ما نقدمه.</p>

                <a href="#" class="btn">ابدأ رحلتك الآن</a>

                <div class="features-grid">
                    <div class="feature-card">
                        <span class="feature-title">🔒 أمان عالي</span>
                        <span class="feature-desc">حماية متقدمة لبياناتك</span>
                    </div>
                    <div class="feature-card">
                        <span class="feature-title">⚡ سرعة فائقة</span>
                        <span class="feature-desc">أداء سلس وسريع</span>
                    </div>
                </div>
            </div>

            <div class="footer">
                <div class="footer-text">&copy; {{ date('Y') }} AuthMaster Inc. نتمنى لك تجربة ممتعة.</div>
            </div>
        </div>
    </div>
</body>
</html>

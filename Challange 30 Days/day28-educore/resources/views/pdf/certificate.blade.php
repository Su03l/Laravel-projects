<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Professional Certificate</title>
    <style>
        /* إعدادات الطباعة الأساسية لإلغاء هوامش المتصفح */
        @page {
            size: A4 portrait;
            margin: 0;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: 'Helvetica', sans-serif;
        }

        /* الحاوية الرئيسية - ثابتة الأبعاد تماماً */
        .cert-page {
            width: 210mm;
            height: 297mm;
            background: #fff;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
        }

        /* الإطار الزخرفي - مثبت بالبكسل لضمان عدم التحرك */
        .border-frame {
            position: absolute;
            top: 40px;
            left: 40px;
            right: 40px;
            bottom: 40px;
            border: 2px solid #00D1FF;
            z-index: 1;
        }

        /* الزوايا الزرقاء */
        .corner {
            position: absolute;
            width: 100px;
            height: 100px;
            border: 6px solid #00D1FF;
            z-index: 2;
        }

        .top-left {
            top: 30px;
            left: 30px;
            border-right: none;
            border-bottom: none;
        }

        .bottom-right {
            bottom: 30px;
            right: 30px;
            border-left: none;
            border-top: none;
        }

        /* المحتوى المركز يدوياً بدون Flex لتجنب مشاكل الإزاحة */
        .main-content {
            position: absolute;
            top: 80px;
            width: 100%;
            text-align: center;
            z-index: 3;
        }

        .logo-box {
            background: #00D1FF;
            color: white;
            width: 60px;
            height: 60px;
            line-height: 60px;
            font-size: 35px;
            font-weight: 800;
            margin: 0 auto 20px;
            border-radius: 5px;
            text-align: center;
        }

        .brand {
            font-size: 22pt;
            font-weight: 700;
            margin-bottom: 50px;
        }

        .brand span {
            color: #00D1FF;
        }

        .cert-title {
            font-size: 45pt;
            font-weight: 800;
            margin: 0;
            letter-spacing: 2px;
            color: #000;
        }

        .cert-sub {
            color: #00D1FF;
            font-size: 15pt;
            letter-spacing: 5px;
            font-weight: 600;
            margin-top: 10px;
        }

        .presented-to {
            margin-top: 60px;
            color: #666;
            font-size: 14pt;
        }

        .name {
            font-size: 38pt;
            font-weight: 800;
            margin: 20px 0;
            display: inline-block;
            border-bottom: 4px solid #00D1FF;
            padding-bottom: 10px;
            min-width: 400px;
            color: #000;
        }

        .description {
            font-size: 14pt;
            color: #444;
            margin-top: 40px;
            line-height: 1.6;
            padding: 0 100px;
        }

        .course-name {
            font-weight: 700;
            font-size: 18pt;
            color: #000;
            display: block;
            margin-top: 10px;
        }

        /* منطقة التواقيع في الأسفل - مثبتة بمسافة من القاع */
        .signatures {
            position: absolute;
            bottom: 120px;
            width: 100%;
            z-index: 3;
        }

        .sig-table {
            width: 100%;
            border-collapse: collapse;
        }

        .sig-col {
            text-align: center;
            width: 50%;
            padding: 0 60px;
        }

        .sig-line {
            border-top: 2px solid #000;
            margin-bottom: 10px;
        }

        .sig-label {
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            color: #000;
        }

        .footer-info {
            position: absolute;
            bottom: 40px;
            width: 100%;
            text-align: center;
            font-size: 9pt;
            color: #999;
            z-index: 3;
        }
    </style>
</head>
<body>

<div class="cert-page">
    <div class="corner top-left"></div>
    <div class="corner bottom-right"></div>
    <div class="border-frame"></div>

    <div class="main-content">
        <div class="logo-box">E</div>
        <div class="brand">EDU<span>CORE</span></div>

        <h1 class="cert-title">CERTIFICATE</h1>
        <div class="cert-sub">OF APPRECIATION</div>

        <p class="presented-to">This certificate is proudly presented to</p>
        <div class="name">{{ $student_name }}</div>

        <p class="description">
            In recognition of successfully completing all requirements for the professional course:
            <span class="course-name">"{{ $course_title }}"</span>
        </p>
    </div>

    <div class="signatures">
        <table class="sig-table">
            <tr>
                <td class="sig-col">
                    <div class="sig-line"></div>
                    <div class="sig-label">Academy Director</div>
                </td>
                <td class="sig-col">
                    <div class="sig-line"></div>
                    <div class="sig-label">Lead Instructor</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer-info">
        Issued on {{ $date }} | Certificate ID: {{ $certificate_id }}
    </div>
</div>

</body>
</html>

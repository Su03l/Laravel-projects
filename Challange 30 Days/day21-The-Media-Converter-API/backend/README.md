# Developer Tools API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![MySQL](https://img.shields.io/badge/MySQL-Database-003B57?style=for-the-badge&logo=mysql) ![Tools](https://img.shields.io/badge/Utilities-API-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 21**

</div>

---

## نظرة عامة

"Developer Tools API" هو نظام أدوات للمطورين (Developer Utilities) يهدف لتسهيل العمليات اليومية مثل توليد رموز QR، معرفة أسعار العملات الرقمية، تحويل النصوص، ومعالجة الصور. يوفر النظام واجهة برمجية (API) سهلة الاستخدام تدعم العربية بالكامل.

## المشكلات التي يحلها

| المشكلة                | الحل                                                     |
| :--------------------- | :------------------------------------------------------- |
| الحاجة لبيانات وهمية   | توليد معرفات UUID وصور واجهة مستخدم للاختبار             |
| تعقيد توليد QR Code    | إنشاء وتحميل رموز QR بصيغ SVG/PNG بضغطة زر               |
| متابعة العملات الرقمية | معرفة أسعار البيتكوين لحظياً مقابل العملات العالمية      |
| التعامل مع التاريخ     | عرض الوقت بصيغة "منذ..." (Human Readable) باللغة العربية |

## المميزات التقنية

`QR Code Generation` `Crypto Prices` `Image Processing` `UUID Generator` `RESTful API` `Text Formatting`

## توثيق الـ API

### الأدوات (Tools)

#### التوقيت (Time)

```http
GET /api/tools/time
# Returns: { future, past, today }
```

#### توليد QR Code

```http
GET /api/tools/qr?text=Laravel&format=svg
# Params: text (string), format (svg/png)
```

#### تحويل النصوص (Text)

```http
GET /api/tools/text?text=Hello World
# Returns: { slug, upper }
```

#### أسعار العملات (Crypto)

```http
GET /api/tools/crypto
# Returns: { bpi: { USD, GBP, EUR ... }, time, disclaimer }
```

#### توليد UUID

```http
GET /api/tools/uuid
# Returns: { uuid_1, uuid_2, uuid_3 }
```

#### معالجة الصور (Image)

```http
GET /api/tools/image
# Returns: PNG Image (600x200)
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   └── ToolController.php       # التحكم بجميع الأدوات
└── routes/
    └── api.php                      # مسارات الأدوات
```

## التثبيت والإعداد

### 1. تثبيت الحزم

```bash
composer install
```

### 2. إعداد البيئة

```bash
cp .env.example .env
php artisan key:generate
```

### 3. تشغيل الخادم

```bash
php artisan serve
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

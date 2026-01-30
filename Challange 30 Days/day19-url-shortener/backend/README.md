# URL Shortener API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![MySQL](https://img.shields.io/badge/MySQL-Database-003B57?style=for-the-badge&logo=mysql) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 19**

</div>

---

## نظرة عامة

"URL Shortener" هو نظام ذكي وسريع لتقصير الروابط الطويلة (API)، يهدف إلى مساعدة المستخدمين على إدارة روابطهم ومشاركتها بسهولة واحترافية. يوفر النظام إحصائيات دقيقة لعدد الزيارات لكل رابط، مع واجهة برمجية آمنة وسهلة الاستخدام.

## المشكلات التي يحلها

| المشكلة                  | الحل                                                              |
| :----------------------- | :---------------------------------------------------------------- |
| الروابط الطويلة والمعقدة | تحويل الروابط الطويلة إلى روابط قصيرة وجذابة سهلة المشاركة والحفظ |
| غياب تتبع الزيارات       | نظام تتبع دقيق يسجل عدد النقرات لكل رابط مختصر                    |
| ضياع الروابط المهمة      | لوحة تحكم مركزية لحفظ وإدارة جميع الروابط الخاصة بالمستخدم        |
| صعوبة المشاركة           | روابط قصيرة مناسبة لوسائل التواصل الاجتماعي والرسائل النصية       |

## المميزات التقنية

`Link Management` `Click Tracking` `Custom Aliases` `Secure Authentication` `RESTful API` `Scalable Architecture`

## توثيق الـ API

### المصادقة (Authentication)

#### تسجيل حساب جديد

```http
POST /api/register
```

#### تسجيل الدخول

```http
POST /api/login
```

#### تسجيل الخروج

```http
POST /api/logout
Authorization: Bearer {token}
```

### إدارة الروابط (Links)

#### عرض الروابط (Dashboard)

```http
GET /api/links       # عرض كل روابط المستخدم
```

#### إنشاء رابط مختصر

```http
POST /api/links      # إنشاء رابط جديد
# Body: { "url": "https://google.com", "name": "Google" }
```

#### تحديث رابط

```http
PUT /api/links/{id}  # تعديل البيانات (الاسم، الرابط الأصلي)
```

#### حذف رابط

```http
DELETE /api/links/{id} # حذف الرابط نهائياً
```

### الإحصائيات (Stats)

#### إحصائيات لوحة التحكم

```http
GET /api/dashboard     # إجمالي الروابط والزيارات
```

#### زيارة الرابط المختصر

```http
GET /{code}            # توجيه الزائر للرابط الأصلي وتسجيل زيارة
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/
│   │   │   └── AuthController.php       # المصادقة
│   │   ├── Link/
│   │   │   └── LinkController.php       # إدارة الروابط
│   │   ├── Dashboard/
│   │   │   └── DashboardController.php  # الإحصائيات
│   ├── Models/
│   │   ├── User.php
│   │   ├── Link.php                     # نموذج الرابط
├── database/
│   ├── migrations/                      # جداول البيانات
└── routes/
    └── api.php                          # المسارات
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

### 3. إعداد قاعدة البيانات

```bash
# قم بإنشاء قاعدة بيانات باسم 'url_shortener'
php artisan migrate
```

### 4. تشغيل الخادم

```bash
php artisan serve
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

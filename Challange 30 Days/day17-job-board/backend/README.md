# Job Board API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![MySQL](https://img.shields.io/badge/MySQL-Database-003B57?style=for-the-badge&logo=mysql) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 17**

</div>

---

## نظرة عامة

"Job Board" هي واجهة برمجة تطبيقات (API) لمنصة توظيف متكاملة، تربط بين الشركات والباحثين عن عمل. تتيح للشركات نشر الوظائف وإدارة الطلبات، وتتيح للباحثين عن عمل تصفح الوظائف والتقديم عليها وإنشاء ملفات شخصية احترافية.

## المشكلات التي يحلها

| المشكلة              | الحل                                                                                |
| :------------------- | :---------------------------------------------------------------------------------- |
| صعوبة البحث عن عمل   | منصة مركزية تجمع الوظائف المتاحة من مختلف الشركات مع خيارات بحث وتصفية متقدمة       |
| إدارة طلبات التوظيف  | لوحة تحكم للشركات لاستقبال الطلبات، فرزها، وتغيير حالتها (قبول، رفض، مراجعة) بسهولة |
| غياب الملفات الشخصية | إمكانية إنشاء ملف شخصي شامل للباحث عن عمل يعرض مهاراته وسيرته الذاتية               |
| التواصل المعقد       | نظام تقديم مباشر يلغي الحاجة للبريد الإلكتروني في المراحل الأولية                   |

## المميزات التقنية

`Job Management` `Application System` `Company Dashboard` `Seeker Profile` `Authentication` `Laravel 11` `RESTful API`

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

### الوظائف (Jobs)

#### عرض جميع الوظائف

```http
GET /api/jobs
```

#### عرض تفاصيل وظيفة

```http
GET /api/jobs/{id}
```

#### نشر وظيفة جديدة (شركات فقط)

```http
POST /api/jobs
Authorization: Bearer {token}
```

#### تعديل وظيفة

```http
PUT /api/jobs/{id}
Authorization: Bearer {token}
```

#### حذف وظيفة

```http
DELETE /api/jobs/{id}
Authorization: Bearer {token}
```

### طلبات التوظيف (Applications)

#### التقديم على وظيفة (باحثين فقط)

```http
POST /api/jobs/{id}/apply
Authorization: Bearer {token}
```

#### عرض المتقدمين لوظيفة (شركات فقط)

```http
GET /api/jobs/{id}/applications
Authorization: Bearer {token}
```

#### تحديث حالة الطلب (شركات فقط)

```http
PUT /api/applications/{id}/status
Authorization: Bearer {token}
```

#### سحب الطلب (باحثين فقط)

```http
DELETE /api/applications/{id}
Authorization: Bearer {token}
```

### الملف الشخصي (Profile)

#### عرض الملف العام

```http
GET /api/users/{name}
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/
│   │   │   └── AuthController.php       # متحكم المصادقة
│   │   ├── Job/
│   │   │   └── JobController.php        # متحكم الوظائف
│   │   ├── Application/
│   │   │   └── ApplicationController.php # متحكم طلبات التوظيف
│   │   ├── UserProfile/
│   │   │   └── UserController.php       # متحكم الملف الشخصي
│   ├── Models/
│   │   ├── User.php                     # نموذج المستخدم
│   │   ├── Job.php                      # نموذج الوظيفة
│   │   ├── Application.php              # نموذج طلب التوظيف
├── database/
│   ├── migrations/                      # جداول قاعدة البيانات
└── routes/
    └── api.php                          # مسارات الـ API
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
# تأكد من إعداد بيانات MySQL في ملف .env
php artisan migrate
php artisan db:seed
```

### 4. تشغيل الخادم

```bash
php artisan serve
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

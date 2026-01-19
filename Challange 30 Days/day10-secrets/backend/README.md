# Identity Hub API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 10**

</div>

---

## نظرة عامة

نظام مركزي لإدارة الهوية والمستخدمين (User Management System). يمثل هذا المشروع حجر الأساس لأي تطبيق حديث، حيث يوفر نظام مصادقة آمن ومرن يدعم تسجيل الدخول باسم المستخدم أو البريد الإلكتروني، مع إدارة كاملة للملف الشخصي.

## المشكلات التي يحلها

| المشكلة              | الحل                                      |
| -------------------- | ----------------------------------------- |
| تعقيد أنظمة المصادقة | نظام مصادقة جاهز ومرن باستخدام Sanctum    |
| صعوبة تسجيل الدخول   | دعم تسجيل الدخول بالإيميل أو اسم المستخدم |
| إدارة الملف الشخصي   | واجهة API متكاملة لعرض وتحديث البيانات    |
| أمان كلمات المرور    | التحقق من كلمة المرور الحالية قبل التغيير |

## المميزات التقنية

`Dual Login` `Token Based Auth` `Profile Management` `Password Security` `Laravel Sanctum` `RESTful API`

## توثيق الـ API

### تسجيل حساب جديد

```http
POST /api/auth/register
```

**البيانات المطلوبة:**

```json
{
    "name": "أحمد محمد",
    "username": "ahmed_m",
    "email": "ahmed@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

### تسجيل الدخول

```http
POST /api/auth/login
```

**البيانات المطلوبة:**

```json
{
    "login": "ahmed@example.com",
    "password": "password123"
}
```

> يمكن استخدام البريد الإلكتروني أو اسم المستخدم في حقل `login`

### تسجيل الخروج

```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### عرض الملف الشخصي

```http
GET /api/user/profile
Authorization: Bearer {token}
```

**الاستجابة:**

```json
{
    "id": 1,
    "name": "أحمد محمد",
    "username": "ahmed_m",
    "email": "ahmed@example.com"
}
```

### تحديث الملف الشخصي

```http
PUT /api/user/profile
Authorization: Bearer {token}
```

**البيانات المطلوبة:**

```json
{
    "name": "أحمد محمد علي",
    "username": "ahmed_ali",
    "email": "ahmed.ali@example.com"
}
```

### تغيير كلمة المرور

```http
POST /api/user/change-password
Authorization: Bearer {token}
```

**البيانات المطلوبة:**

```json
{
    "current_password": "password123",
    "password": "newpassword456",
    "password_confirmation": "newpassword456"
}
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/
│   │   │   └── AuthController.php       # متحكم المصادقة
│   │   └── User/
│   │       └── UserController.php       # متحكم الملف الشخصي
│   └── Models/
│       └── User.php                     # نموذج المستخدم
├── database/
│   └── migrations/                      # جداول قاعدة البيانات
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
php artisan migrate
```

### 4. تشغيل الخادم

```bash
php artisan serve
```

> الخادم يعمل على: `http://127.0.0.1:8000`

## نقاط الاتصال

| الطريقة | المسار                      | الوصف                       |
| :------ | :-------------------------- | :-------------------------- |
| POST    | `/api/auth/register`        | تسجيل حساب جديد             |
| POST    | `/api/auth/login`           | تسجيل دخول (Email/Username) |
| POST    | `/api/auth/logout`          | تسجيل خروج (يتطلب Token)    |
| GET     | `/api/user/profile`         | عرض بيانات المستخدم         |
| PUT     | `/api/user/profile`         | تحديث البيانات              |
| POST    | `/api/user/change-password` | تغيير كلمة المرور           |

---

<div align="center">

**صُنع ضمن تحدي 30 يوم 30 مشروع**

</div>

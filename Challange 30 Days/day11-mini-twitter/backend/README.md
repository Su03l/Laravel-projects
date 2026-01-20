# Mini Twitter API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 11**

</div>

---

## نظرة عامة

نظام Mini Twitter - منصة تغريدات بسيطة تتيح للمستخدمين مشاركة أفكارهم مع العالم. يوفر المشروع نظام مصادقة كامل، إدارة الملف الشخصي، ونظام تغريدات متكامل مع إمكانية الإنشاء والتعديل والحذف.

## المشكلات التي يحلها

| المشكلة              | الحل                                      |
| -------------------- | ----------------------------------------- |
| تعقيد أنظمة المصادقة | نظام مصادقة جاهز ومرن باستخدام Sanctum    |
| صعوبة تسجيل الدخول   | دعم تسجيل الدخول بالإيميل أو اسم المستخدم |
| إدارة المحتوى        | نظام تغريدات كامل CRUD                    |
| أمان البيانات        | التحقق من الملكية قبل التعديل أو الحذف    |

## المميزات التقنية

`Dual Login` `Token Based Auth` `Tweet CRUD` `Profile Management` `Password Security` `Laravel Sanctum` `RESTful API`

## توثيق الـ API

### المصادقة

#### تسجيل حساب جديد

```http
POST /api/auth/register
```

```json
{
    "name": "سليمان",
    "username": "sull",
    "email": "suliman@gmail.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

#### تسجيل الدخول

```http
POST /api/auth/login
```

```json
{
    "login": "sull",
    "password": "password123"
}
```

> يمكن استخدام البريد الإلكتروني أو اسم المستخدم في حقل `login`

#### تسجيل الخروج

```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### الملف الشخصي

#### عرض الملف الشخصي

```http
GET /api/user/profile
Authorization: Bearer {token}
```

#### تحديث الملف الشخصي

```http
PUT /api/user/profile
Authorization: Bearer {token}
```

```json
{
    "name": "سليمان أحمد",
    "username": "suliman_a",
    "email": "suliman.a@example.com"
}
```

#### تغيير كلمة المرور

```http
POST /api/user/change-password
Authorization: Bearer {token}
```

```json
{
    "current_password": "password123",
    "password": "newpassword456",
    "password_confirmation": "newpassword456"
}
```

### التغريدات

#### عرض جميع التغريدات (عام)

```http
GET /api/tweets
```

#### عرض تغريداتي

```http
GET /api/user/tweets
Authorization: Bearer {token}
```

#### إنشاء تغريدة

```http
POST /api/tweets
Authorization: Bearer {token}
```

```json
{
    "content": "مرحباً بالعالم! هذه أول تغريدة لي 🎉"
}
```

#### تعديل تغريدة

```http
PUT /api/tweets/{id}
Authorization: Bearer {token}
```

```json
{
    "content": "تم تعديل التغريدة ✏️"
}
```

#### حذف تغريدة

```http
DELETE /api/tweets/{id}
Authorization: Bearer {token}
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/
│   │   │   └── AuthController.php       # متحكم المصادقة
│   │   ├── User/
│   │   │   └── UserController.php       # متحكم الملف الشخصي
│   │   └── Tweet/
│   │       └── TweetController.php      # متحكم التغريدات
│   ├── Http/Resources/
│   │   └── Tweet/
│   │       └── TweetResource.php        # مورد التغريدة
│   └── Models/
│       ├── User.php                     # نموذج المستخدم
│       └── Tweet.php                    # نموذج التغريدة
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
| GET     | `/api/tweets`               | عرض جميع التغريدات (عام)    |
| GET     | `/api/user/tweets`          | عرض تغريداتي (يتطلب Token)  |
| POST    | `/api/tweets`               | إنشاء تغريدة جديدة          |
| PUT     | `/api/tweets/{id}`          | تعديل تغريدة                |
| DELETE  | `/api/tweets/{id}`          | حذف تغريدة                  |

---

<div align="center">

**صُنع ضمن تحدي 30 يوم 30 مشروع**

</div>

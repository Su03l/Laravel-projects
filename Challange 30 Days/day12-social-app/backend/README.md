# تغريداتي API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 12**

</div>

---

## نظرة عامة

تطبيق تغريدات مصغر - منصة تواصل اجتماعي بسيطة تتيح للمستخدمين مشاركة أفكارهم ومتابعة الآخرين. يوفر المشروع نظام مصادقة كامل، إدارة الملف الشخصي، نظام متابعة، ونظام تغريدات متكامل.

## المشكلات التي يحلها

| المشكلة              | الحل                                      |
| -------------------- | ----------------------------------------- |
| تعقيد أنظمة المصادقة | نظام مصادقة جاهز ومرن باستخدام Sanctum    |
| صعوبة تسجيل الدخول   | دعم تسجيل الدخول بالإيميل أو اسم المستخدم |
| إدارة المحتوى        | نظام تغريدات كامل CRUD                    |
| التواصل الاجتماعي    | نظام متابعة متكامل                        |
| أمان البيانات        | التحقق من الملكية قبل التعديل أو الحذف    |

## المميزات التقنية

`Dual Login` `Token Based Auth` `Tweet CRUD` `Follow System` `Profile Management` `Suggested Users` `Laravel Sanctum` `RESTful API`

## توثيق الـ API

### المصادقة

#### تسجيل حساب جديد

```http
POST /api/auth/register
```

```json
{
    "name": "أحمد محمد",
    "username": "ahmed_dev",
    "email": "ahmed@example.com",
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
    "login": "ahmed_dev",
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
    "name": "أحمد علي",
    "username": "ahmed_ali",
    "email": "ahmed.ali@example.com"
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
    "new_password": "newpassword456",
    "new_password_confirmation": "newpassword456"
}
```

### التغريدات

#### عرض جميع التغريدات (عام)

```http
GET /api/tweets
```

#### عرض تغريدة واحدة

```http
GET /api/tweets/{id}
```

#### إنشاء تغريدة

```http
POST /api/tweets
Authorization: Bearer {token}
```

```json
{
    "content": "مرحبا بالعالم! هذه أول تغريدة لي"
}
```

#### تعديل تغريدة

```http
PUT /api/tweets/{id}
Authorization: Bearer {token}
```

```json
{
    "content": "تم تعديل التغريدة"
}
```

#### حذف تغريدة

```http
DELETE /api/tweets/{id}
Authorization: Bearer {token}
```

### المستخدمين

#### عرض ملف مستخدم عام

```http
GET /api/users/{username}
```

#### اقتراحات للمتابعة

```http
GET /api/users-suggested
```

### نظام المتابعة

#### متابعة مستخدم

```http
POST /api/follow
Authorization: Bearer {token}
```

```json
{
    "user_id": 5
}
```

#### إلغاء المتابعة

```http
DELETE /api/unfollow/{id}
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
│   │   ├── Tweet/
│   │   │   └── TweetController.php      # متحكم التغريدات
│   │   └── Follow/
│   │       └── FollowController.php     # متحكم المتابعة
│   ├── Http/Resources/
│   │   └── Tweet/
│   │       └── TweetResource.php        # مورد التغريدة
│   └── Models/
│       ├── User.php                     # نموذج المستخدم
│       ├── Tweet.php                    # نموذج التغريدة
│       └── Follow.php                   # نموذج المتابعة
├── database/
│   ├── factories/
│   │   ├── UserFactory.php              # مولد المستخدمين
│   │   └── TweetFactory.php             # مولد التغريدات
│   ├── migrations/                      # جداول قاعدة البيانات
│   └── seeders/
│       └── DatabaseSeeder.php           # بذر البيانات
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
# Windows
type nul > database/database.sqlite

# Mac/Linux
touch database/database.sqlite
```

### 4. تشغيل الـ Migrations مع البيانات الوهمية

```bash
php artisan migrate:fresh --seed
```

### 5. تشغيل الخادم

```bash
php artisan serve
```

> الخادم يعمل على: `http://127.0.0.1:8000`

## استخدام الـ Factory و Seeder

### ماذا يفعل الـ Seeder؟

عند تشغيل `php artisan migrate:fresh --seed`:

- يتم إنشاء **50 مستخدم**
- كل مستخدم لديه **50 تغريدة**
- علاقات متابعة عشوائية (10-25 متابعة لكل مستخدم)

### إنشاء بيانات يدويا

```bash
php artisan tinker
```

```php
# إنشاء مستخدم واحد
User::factory()->create();

# إنشاء 10 مستخدمين
User::factory(10)->create();

# إنشاء مستخدم مع تغريدات
$user = User::factory()->create();
Tweet::factory(20)->create(['user_id' => $user->id]);

# إنشاء مستخدم بمعلومات محددة
User::factory()->create([
    'name' => 'محمد أحمد',
    'username' => 'mohammed',
    'email' => 'mohammed@test.com'
]);
```

### إعادة تعبئة البيانات

```bash
php artisan migrate:fresh --seed
```

## الحساب التجريبي

| البريد الإلكتروني  | كلمة المرور |
| ------------------ | ----------- |
| khaled@example.com | password123 |

## نقاط الاتصال

| الطريقة | المسار                      | الوصف               | الحماية |
| :------ | :-------------------------- | :------------------ | :------ |
| POST    | `/api/auth/register`        | تسجيل حساب جديد     | عام     |
| POST    | `/api/auth/login`           | تسجيل دخول          | عام     |
| POST    | `/api/auth/logout`          | تسجيل خروج          | Token   |
| GET     | `/api/user/profile`         | عرض بيانات المستخدم | Token   |
| PUT     | `/api/user/profile`         | تحديث البيانات      | Token   |
| POST    | `/api/user/change-password` | تغيير كلمة المرور   | Token   |
| GET     | `/api/tweets`               | عرض جميع التغريدات  | عام     |
| GET     | `/api/tweets/{id}`          | عرض تغريدة واحدة    | عام     |
| POST    | `/api/tweets`               | إنشاء تغريدة        | Token   |
| PUT     | `/api/tweets/{id}`          | تعديل تغريدة        | Token   |
| DELETE  | `/api/tweets/{id}`          | حذف تغريدة          | Token   |
| GET     | `/api/users/{username}`     | عرض ملف مستخدم عام  | عام     |
| GET     | `/api/users-suggested`      | اقتراحات للمتابعة   | عام     |
| POST    | `/api/follow`               | متابعة مستخدم       | Token   |
| DELETE  | `/api/unfollow/{id}`        | إلغاء المتابعة      | Token   |

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

# سحابتي API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 13**

</div>

---

## نظرة عامة

"سحابتي" هو نظام تخزين سحابي شخصي مصغر يتيح للمستخدمين إدارة ملفاتهم ومجلداتهم بفعالية. يوفر المشروع نظام مصادقة كامل، إدارة متطورة للمجلدات المتداخلة، ونظام رفع وتخزين ملفات آمن مع إمكانية المعاينة.

## المشكلات التي يحلها

| المشكلة             | الحل                                        |
| ------------------- | ------------------------------------------- |
| تعقيد أنظمة الملفات | واجهة برمجية منظمة لإدارة المجلدات والملفات |
| أمان البيانات       | نظام مصادقة قوي وتحقق من ملكية الملفات      |
| فوضى الملفات        | نظام مجلدات هرمي (Nested Folders) منظم      |
| الوصول للملفات      | إمكانية تحميل ومعاينة الملفات من أي مكان    |
| إدارة الحساب        | ملف شخصي متكامل مع إمكانية رفع صورة رمزية   |

## المميزات التقنية

`File Upload` `Folder Management` `Nested Hierarchy` `Profile Avatar` `Token Auth` `Image Preview` `Laravel 11` `RESTful API`

## توثيق الـ API

### المصادقة

#### تسجيل حساب جديد

```http
POST /api/auth/register
```

#### تسجيل الدخول

```http
POST /api/auth/login
```

### الملف الشخصي (User Profile)

#### عرض بيانات الملف الشخصي

```http
GET /api/user/profile
Authorization: Bearer {token}
```

#### تحديث الملف الشخصي والأفاتار

```http
PUT /api/user/profile
Authorization: Bearer {token}
# يدعم FormData لرفع الصورة
```

#### تغيير كلمة المرور

```http
POST /api/user/change-password
Authorization: Bearer {token}
```

### المجلدات (Folders)

#### عرض المجلدات الحالية

```http
GET /api/folders
GET /api/folders/{id} # عرض محتويات مجلد معين
```

#### إنشاء مجلد

```http
POST /api/folders
```

#### حذف مجلد

```http
DELETE /api/folders/{id}
```

### الملفات (Files)

#### رفع ملف جديد

```http
POST /api/files/upload
```

#### تحميل ملف

```http
GET /api/files/{id}/download
```

#### حذف ملف

```http
DELETE /api/files/{id}
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
│   │   ├── Folder/
│   │   │   └── FolderController.php     # متحكم المجلدات
│   │   └── File/
│   │       └── FileController.php       # متحكم الملفات
│   └── Models/
│       ├── User.php                     # نموذج المستخدم
│       ├── Folder.php                   # نموذج المجلد
│       └── File.php                     # نموذج الملف
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

### 3. إعداد قاعدة البيانات وتفعيل رابط التخزين

```bash
touch database/database.sqlite
php artisan migrate
php artisan storage:link
```

### 4. تشغيل الخادم

```bash
php artisan serve
```

## الحساب التجريبي

| البريد الإلكتروني  | كلمة المرور |
| ------------------ | ----------- |
| khaled@example.com | password123 |

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

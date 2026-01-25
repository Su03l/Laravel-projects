# Tech News API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![MySQL](https://img.shields.io/badge/MySQL-Database-003B57?style=for-the-badge&logo=mysql) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 16**

</div>

---

## نظرة عامة

"Tech News" هي واجهة برمجة تطبيقات (API) لمنصة إخبارية تقنية، تتيح للمستخدمين تصفح المقالات، قراءتها، والتفاعل معها عبر التعليقات، بالإضافة إلى لوحة تحكم للمستخدمين لإدارة مقالاتهم الخاصة.

## المشكلات التي يحلها

| المشكلة                | الحل                                                                |
| :--------------------- | :------------------------------------------------------------------ |
| تشتت المصادر التقنية   | منصة مركزية تجمع أحدث المقالات والأخبار التقنية                     |
| غياب التفاعل المجتمعي  | نظام تعليقات متكامل يتيح للنقاش وتبادل الآراء حول المقالات          |
| صعوبة النشر للمستخدمين | واجهة وسيطة (API) مرنة تتيح للمستخدمين المسجلين نشر مقالاتهم بسهولة |
| إدارة المحتوى          | لوحة تحكم تتيح للمستخدم تعديل وحذف مقالاته وعرض أرشيفه الخاص        |

## المميزات التقنية

`Article Management` `Comment System` `User Dashboard` `Category Filtering` `Authentication` `Laravel 11` `RESTful API`

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

### المقالات (Articles)

#### عرض جميع المقالات (الرئيسية)

```http
GET /api/articles
```

#### عرض المقالات الحديثة (Recent)

```http
GET /api/articles?recent=true
```

#### عرض تفاصيل مقال

```http
GET /api/articles/{id}
```

#### نشر مقال جديد

```http
POST /api/articles
Authorization: Bearer {token}
```

#### تعديل مقال

```http
PUT /api/articles/{id}
Authorization: Bearer {token}
```

#### حذف مقال

```http
DELETE /api/articles/{id}
Authorization: Bearer {token}
```

### التعليقات (Comments)

#### عرض تعليقات مقال

```http
GET /api/articles/{id}/comments
```

#### إضافة تعليق

```http
POST /api/articles/{id}/comments
Authorization: Bearer {token}
```

#### حذف تعليق

```http
DELETE /api/comments/{id}
Authorization: Bearer {token}
```

### التصنيفات (Categories)

#### عرض قائمة التصنيفات

```http
GET /api/categories
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/
│   │   │   └── AuthController.php       # متحكم المصادقة
│   │   ├── Article/
│   │   │   ├── ArticleController.php    # متحكم المقالات
│   │   │   └── CommentController.php    # متحكم التعليقات
│   │   └── CategoryController.php       # متحكم التصنيفات
│   ├── Models/
│   │   ├── User.php                     # نموذج المستخدم
│   │   ├── Article.php                  # نموذج المقال
│   │   ├── Comment.php                  # نموذج التعليق
│   │   └── Category.php                 # نموذج التصنيف
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

# متجري API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 14**

</div>

---

## نظرة عامة

"متجري" هو واجهة برمجة تطبيقات (API) لمتجر إلكتروني متكامل، يتيح للمستخدمين تصفح المنتجات والأقسام، وإدارة طلبات الشراء. كما يوفر لوحة تحكم إدارية كاملة لإدارة المخزون والطلبات.

## المشكلات التي يحلها

| المشكلة              | الحل                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| تجربة التسوق المعقدة | واجهة برمجية بسيطة وسريعة لتصفح وشراء المنتجات                        |
| إدارة المخزون        | نظام إداري متكامل (Admin) للتحكم في الأقسام والمنتجات                 |
| تتبع الطلبات         | نظام آلي لإنشاء ومتابعة وإلغاء الطلبات للمستخدمين                     |
| أمان الحسابات        | مصادقة قوية باستخدام Laravel Sanctum مع أدوار للمستخدمين (User/Admin) |
| سهولة الوصول         | إمكانية تصفح المنتجات دون الحاجة لتسجيل دخول إلزامي                   |

## المميزات التقنية

`Product Browsing` `Category Management` `Order System` `Admin Dashboard` `Role-Based Access` `Profile Management` `Laravel 11` `RESTful API`

## توثيق الـ API

### المصادقة (Authentication)

#### تسجيل حساب جديد

```http
POST /api/auth/register
```

#### تسجيل الدخول

```http
POST /api/auth/login
```

### تصفح المتجر (Public Routes)

#### عرض جميع الأقسام

```http
GET /api/categories
```

#### عرض قسم محدد ومنتجاته

```http
GET /api/categories/{id}
```

#### عرض جميع المنتجات

```http
GET /api/products
```

#### عرض تفاصيل منتج معين

```http
GET /api/products/{id}
```

### إدارة الحساب (User Profile)

#### عرض بيانات الملف الشخصي

```http
GET /api/user/profile
Authorization: Bearer {token}
```

#### تحديث الملف الشخصي

```http
PUT /api/user/profile
Authorization: Bearer {token}
```

#### تغيير كلمة المرور

```http
POST /api/user/change-password
Authorization: Bearer {token}
```

### نظام الطلبات (Orders)

#### إنشاء طلب جديد (Checkout)

```http
POST /api/checkout
Authorization: Bearer {token}
```

#### عرض طلباتي

```http
GET /api/orders
Authorization: Bearer {token}
```

#### تفاصيل طلب محدد

```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

#### إلغاء طلب

```http
POST /api/orders/{id}/cancel
Authorization: Bearer {token}
```

### لوحة الإدارة (Admin Dashboard)

#### إدارة الأقسام (إضافة/تعديل/حذف)

```http
POST /api/categories
PUT /api/categories/{id}
DELETE /api/categories/{id}
Authorization: Bearer {admin_token}
```

#### إدارة المنتجات (إضافة/تعديل/حذف)

```http
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
Authorization: Bearer {admin_token}
```

#### عرض جميع طلبات المتجر

```http
GET /api/admin/orders
Authorization: Bearer {admin_token}
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
│   │   ├── Ecommerce/
│   │   │   ├── ProductController.php    # متحكم المنتجات
│   │   │   └── CategoryController.php   # متحكم الأقسام
│   │   └── Order/
│   │       └── OrderController.php      # متحكم الطلبات
│   ├── Models/
│   │   ├── User.php                     # نموذج المستخدم
│   │   ├── Product.php                  # نموذج المنتج
│   │   ├── Category.php                 # نموذج القسم
│   │   ├── Order.php                    # نموذج الطلب
│   │   └── OrderItem.php                # نموذج تفاصيل الطلب
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
php artisan db:seed # إذا توفرت بيانات تجريبية
php artisan storage:link
```

### 4. تشغيل الخادم

```bash
php artisan serve
```

## الحساب التجريبي

| الدور         | البريد الإلكتروني | كلمة المرور |
| ------------- | ----------------- | ----------- |
| مدير (Admin)  | admin@example.com | password123 |
| مستخدم (User) | user@example.com  | password123 |

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

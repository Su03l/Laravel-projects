# PayFlow API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 15**

</div>

---

## نظرة عامة

"PayFlow" هي واجهة برمجة تطبيقات (API) لمحفظة رقمية متكاملة، تتيح للمستخدمين إدارة أموالهم، وإجراء عمليات الإيداع والتحويل بين الحسابات، وإدارة قائمة المستفيدين الخاصة بهم مع سجل كامل للعمليات.

## المشكلات التي يحلها

| المشكلة               | الحل                                                                  |
| :-------------------- | :-------------------------------------------------------------------- |
| صعوبة إدارة الأموال   | واجهة بسيطة لإيداع وتحويل الأموال بسرعة وأمان                         |
| تعقيد التحويل المتكرر | نظام إدارة مستفيدين (Beneficiaries) لتوفير الوقت في العمليات المتكررة |
| غياب تتبع العمليات    | سجل معاملات تفصيلي يوضح الوارد والمنصرف بدقة                          |
| مخاطر الأمان          | مصادقة قوية باستخدام Laravel Sanctum مع حماية للعمليات الحساسة        |

## المميزات التقنية

`Wallet Management` `Safe Transfers` `Beneficiary System` `Transaction History` `Real-time Balance` `Laravel 11` `RESTful API` `Atomic Transactions`

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

### إدارة الحساب (User Profile)

#### عرض بيانات الملف الشخصي

```http
GET /api/me
Authorization: Bearer {token}
```

#### تحديث الملف الشخصي (الاسم، البريد)

```http
PUT /api/me
Authorization: Bearer {token}
```

### إدارة المستفيدين (Beneficiaries)

#### عرض قائمة المستفيدين

```http
GET /api/beneficiaries
```

#### إضافة مستفيد جديد

```http
POST /api/beneficiaries
```

#### تعديل بيانات مستفيد (اسم مستعار)

```http
PUT /api/beneficiaries/{id}
```

#### حذف مستفيد

```http
DELETE /api/beneficiaries/{id}
```

### العمليات المالية (Wallet Operations)

#### إيداع مالي (Deposit)

```http
POST /api/deposit
```

#### تحويل مالي (Transfer)

```http
POST /api/transfer
```

#### سجل العمليات (History)

```http
GET /api/transactions
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
│   │   ├── Transfer/
│   │   │   └── TransferController.php   # متحكم العمليات المالية والسجل
│   │   └── BeneficiaryController.php    # متحكم إدارة المستفيدين
│   ├── Models/
│   │   ├── User.php                     # نموذج المستخدم (يتضمن الحساب البنكي)
│   │   ├── Beneficiary.php              # نموذج المستفيد
│   │   └── Transaction.php              # نموذج العمليات المالية
├── database/
│   ├── migrations/                      # جداول المحفظة والعمليات
└── routes/
    └── api.php                          # مسارات الـ API المحمية
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
touch database/database.sqlite
php artisan migrate
php artisan db:seed # إذا توفرت بيانات تجريبية
```

### 4. تشغيل الخادم

```bash
php artisan serve
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

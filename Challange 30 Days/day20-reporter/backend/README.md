# Financial Dashboard API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![MySQL](https://img.shields.io/badge/MySQL-Database-003B57?style=for-the-badge&logo=mysql) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 20**

</div>

---

## نظرة عامة

"Financial Dashboard" هو نظام مالي متكامل (Invoicing System) يهدف لتسهيل إدارة الفواتير والمصاريف والإيرادات للشركات الصغيرة والمتوسطة. يوفر النظام لوحة تحكم تعرض الوضع المالي في الوقت الفعلي، مع إمكانية تصدير التقارير والفواتير (PDF/Excel) بدعم كامل للغة العربية.

## المشكلات التي يحلها

| المشكلة                | الحل                                                       |
| :--------------------- | :--------------------------------------------------------- |
| تعقيد الحسابات اليدوية | لوحة تحكم تعرض صافي الربح، الدخل، والمصاريف تلقائياً       |
| صعوبة إصدار الفواتير   | إنشاء وتحميل فواتير PDF احترافية بضغطة زر                  |
| تقارير غير منظمة       | تصدير جميع العمليات لملف Excel للمحاسبة والمراجعة          |
| مشكلة النصوص العربية   | دعم فني كامل للغة العربية في ملفات PDF (Reshaping Support) |

## المميزات التقنية

`Role-based Auth` `Arabic PDF Generation` `Excel Export` `Real-time Stats` `RESTful API` `Financial Charting Data`

## توثيق الـ API

### المصادقة (Auth)

#### تسجيل الدخول

```http
POST /api/login
# Body: { "email": "user@example.com", "password": "password" }
```

#### إضافة موظف (Admin Only)

```http
POST /api/admin/add-employee
# Body: { "name": "Name", "email": "email", "password": "pass" }
# Header: Authorization: Bearer {token}
```

### العمليات المالية (Transactions)

#### عرض العمليات

```http
GET /api/transactions
```

#### إضافة عملية (دخل/صرف)

```http
POST /api/transactions
# Body: {
#   "title": "Hosting",
#   "amount": 150.00,
#   "type": "expense",
#   "company_name": "Digital Ocean",
#   "date": "2024-01-01"
# }
```

#### الإحصائيات

```http
GET /api/stats
# Returns: { total_income, total_expense, net_profit, count }
```

### التقارير (Reports)

#### تحميل تقرير Excel

```http
GET /api/report/excel
```

#### تحميل فاتورة PDF

```http
GET /api/report/invoice/{id}
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/
│   │   │   └── AuthController.php       # تسجيل الدخول
│   │   ├── Transaction/
│   │   │   └── TransactionController.php # إدارة العمليات والتقارير
│   │   ├── Admin/
│   │   │   └── AdminController.php      # إدارة الموظفين
│   ├── Models/
│   │   ├── User.php
│   │   ├── Transaction.php              # نموذج العملية المالية
├── resources/
│   └── views/
│       └── reports/
│           └── invoice.blade.php        # قالب الفاتورة
└── routes/
    └── api.php                          # المسارات وتوثيقها
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
# قم بإنشاء قاعدة بيانات وإعداد ملف .env
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

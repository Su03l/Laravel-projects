# Mini ERP API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![MySQL](https://img.shields.io/badge/MySQL-Database-003B57?style=for-the-badge&logo=mysql) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 18**

</div>

---

## نظرة عامة

"Mini ERP" هو نظام تخطيط موارد مؤسسات مصغر (API) يهدف إلى مساعدة الشركات الصغيرة ومتوسطة الحجم على إدارة عملياتها اليومية بكفاءة. يربط النظام بين الموارد البشرية، إدارة المشاريع، العلاقات مع العملاء، والشؤون المالية في منصة مركزية واحدة.

## المشكلات التي يحلها

| المشكلة               | الحل                                                                    |
| :-------------------- | :---------------------------------------------------------------------- |
| تشتت البيانات         | قاعدة بيانات مركزية تجمع الموظفين، العملاء، والمشاريع في مكان واحد      |
| فوضى الحضور والانصراف | نظام تسجيل رقمي للحضور والانصراف مع حساب ساعات العمل تلقائياً           |
| تعقيد إدارة الإجازات  | تدفق عمل واضح لتقديم وقبول/رفض طلبات الإجازات مع تتبع الأرصدة           |
| العشوائية المالية     | إدارة متكاملة للفواتير وتتبع الإيرادات والمصروفات مع تقارير أرباح فورية |

## المميزات التقنية

`Employee Management` `Project Tracking` `Financial System` `Attendance Logging` `Leave Requests` `Role Based Access` `RESTful API`

## توثيق الـ API

### المصادقة (Authentication)

#### تسجيل حساب جديد (للموظفين الجدد)

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

### الموارد البشرية (HR)

#### إدارة الموظفين

```http
GET /api/employees       # عرض الكل
POST /api/employees      # إضافة موظف
PUT /api/employees/{id}  # تعديل بيانات
DELETE /api/employees/{id} # حذف موظف
```

### إدارة المشاريع (Projects)

#### العمليات الأساسية

```http
GET /api/projects        # قائمة المشاريع
POST /api/projects       # مشروع جديد
PUT /api/projects/{id}   # تحديث حالة/بيانات المشروع
DELETE /api/projects/{id}
```

### المالية (Finance)

#### إدارة الفواتير

```http
GET /api/invoices        # عرض الفواتير
POST /api/invoices       # إنشاء فاتورة
PUT /api/invoices/{id}   # تحديث (دفع/تعديل)
DELETE /api/invoices/{id}
```

### الحضور والإجازات (Attendance & Leaves)

#### تسجيل الحضور/الخروج

```http
POST /api/attendance/check-in
POST /api/attendance/check-out
```

#### طلب إجازة

```http
POST /api/leaves
```

#### إدارة الإجازات (للمدراء)

```http
GET /api/leaves          # عرض كل الطلبات
PUT /api/leaves/{id}/status # قبول/رفض
```

### لوحة التحكم (Dashboard)

#### الإحصائيات العامة

```http
GET /api/dashboard
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/
│   │   │   └── AuthController.php       # المصادقة
│   │   ├── Employee/
│   │   │   └── EmployeeController.php   # الموظفين
│   │   ├── Project/
│   │   │   └── ProjectController.php    # المشاريع
│   │   ├── Invoice/
│   │   │   └── InvoiceController.php    # الفواتير
│   │   ├── Attendance/
│   │   │   └── AttendanceController.php # الحضور
│   │   ├── Leave/
│   │   │   └── LeaveController.php      # الإجازات
│   │   ├── Dashboard/
│   │   │   └── DashboardController.php  # الإحصائيات
│   ├── Models/
│   │   ├── User.php
│   │   ├── Project.php
│   │   ├── Invoice.php
│   │   ├── Attendance.php
│   │   ├── Leave.php
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
# قم بإنشاء قاعدة بيانات باسم 'mini_erp' أو حسب إعداداتك
php artisan migrate
php artisan db:seed --class=UserSeeder # لإضافة حساب مدير افتراضي
```

### 4. تشغيل الخادم

```bash
php artisan serve
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

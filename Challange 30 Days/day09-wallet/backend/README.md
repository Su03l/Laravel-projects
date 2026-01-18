# المحفظة الذكية - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)

**تحدي 30 يوم 30 مشروع - اليوم 9**

</div>

---

## نظرة عامة

نظام مالي متكامل (API) لإدارة المصاريف الشخصية. يتيح النظام تسجيل العمليات المالية (إيرادات ومصروفات)، تعديلها، حذفها، وعرض تقارير إحصائية فورية حول الوضع المالي.

## المشكلات التي يحلها

| المشكلة             | الحل                                    |
| ------------------- | --------------------------------------- |
| صعوبة تتبع المصاريف | واجهة API بسيطة لتسجيل كل عملية         |
| غياب الرؤية المالية | إحصائيات فورية للدخل والمصروفات والرصيد |
| البحث في السجلات    | فلترة متقدمة حسب النوع والتاريخ         |
| دقة الحسابات        | استخدام Aggregation لحساب الأرصدة بدقة  |

## المميزات التقنية

`CRUD Operations` `Dashboard Stats` `Advanced Filtering` `Data Casting` `RESTful API`

## توثيق الـ API

### إحصائيات المحفظة

```http
GET /api/wallet/stats
```

**الاستجابة:**

```json
{
    "total_income": 10000,
    "total_expense": 4500,
    "balance": 5500,
    "transaction_count": 12,
    "status": "Good"
}
```

### قائمة المعاملات

```http
GET /api/transactions
GET /api/transactions?type=expense&month=10
```

**الاستجابة:**

```json
[
    {
        "id": 1,
        "title": "راتب شهري",
        "amount": 5000,
        "type": "income",
        "transaction_date": "2024-01-15"
    }
]
```

### إضافة معاملة

```http
POST /api/transactions
```

**البيانات المطلوبة:**

```json
{
    "title": "شراء بقالة",
    "amount": 350.5,
    "type": "expense",
    "transaction_date": "2024-01-20"
}
```

### تعديل معاملة

```http
PUT /api/transactions/{id}
```

### حذف معاملة

```http
DELETE /api/transactions/{id}
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   └── WalletController.php     # المتحكم الرئيسي
│   └── Models/
│       └── Transaction.php          # نموذج المعاملات
├── database/
│   └── migrations/                  # جداول قاعدة البيانات
└── routes/
    └── api.php                      # مسارات الـ API
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

## نموذج البيانات

| الحقل            | النوع  | الوصف             |
| ---------------- | ------ | ----------------- |
| title            | string | عنوان المعاملة    |
| amount           | float  | المبلغ            |
| type             | enum   | income أو expense |
| transaction_date | date   | تاريخ المعاملة    |

---

<div align="center">

**صُنع ضمن تحدي 30 يوم 30 مشروع**

</div>

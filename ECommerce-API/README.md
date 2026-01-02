# نظام متجر إلكتروني متكامل (Advanced E-Commerce API)

مشروع Backend متقدم لنظام تجارة إلكترونية، يركز على **دقة المعاملات المالية والمخزنية (Data Integrity)** و **إدارة الملفات**.
يحل هذا المشروع مشكلة "تضارب الطلبات" (Race Conditions) ويضمن عدم بيع منتجات غير متوفرة باستخدام تقنيات قواعد البيانات المتقدمة.

## أبرز المميزات التقنية (Key Features)

-   **العمليات الآمنة (Database Transactions):** استخدام `DB::beginTransaction` لضمان تنفيذ عملية الشراء (إنشاء الطلب + خصم المخزون) ككتلة واحدة، أو التراجع عنها بالكامل في حال حدوث خطأ.
-   **منع تضارب الطلبات (Concurrency Control):** استخدام `lockForUpdate()` لمنع مستخدمين من شراء آخر قطعة في نفس اللحظة.
-   **إدارة المخزون الذكية (Smart Stock):**
    -   خصم الكمية تلقائياً عند الشراء.
    -   **استرجاع الكمية تلقائياً** للمخزون عند إلغاء الطلب (`DELETE`).
-   **رفع الصور (File Uploads):** نظام متكامل لرفع صور المنتجات وتخزينها في `public/storage` وحذفها عند حذف المنتج.
-   **إدارة الحساب:** تحديث البيانات الشخصية وتغيير كلمة المرور بشكل آمن.

## التقنيات المستخدمة

-   **Laravel 10/11** Framework.
-   **Laravel Sanctum** (Authentication).
-   **SQLite** (Database).
-   **Multipart/Form-Data** (For Image Uploads).
-   **PHP Traits & Eloquent Relationships.**

## دليل الروابط (API Endpoints)

### عامة (Public) - لا تتطلب تسجيل دخول

| الطريقة | الرابط                 | الوصف                   |
| :------ | :--------------------- | :---------------------- |
| `POST`  | `/api/register`        | إنشاء حساب جديد         |
| `POST`  | `/api/login`           | تسجيل الدخول            |
| `GET`   | `/api/categories`      | عرض الأقسام             |
| `GET`   | `/api/categories/{id}` | عرض تفاصيل قسم          |
| `GET`   | `/api/products`        | عرض المنتجات (مع الصور) |
| `GET`   | `/api/products/{id}`   | عرض تفاصيل منتج         |

### منطقة المستخدم (User & Orders) - تتطلب Token

| الطريقة  | الرابط                  | الوصف                            |
| :------- | :---------------------- | :------------------------------- |
| `POST`   | `/api/logout`           | تسجيل الخروج                     |
| `GET`    | `/api/profile`          | عرض بياناتي                      |
| `PUT`    | `/api/profile`          | تحديث الاسم والإيميل             |
| `PUT`    | `/api/profile/password` | تغيير كلمة المرور                |
| `POST`   | `/api/orders`           | **إتمام الشراء (Checkout)**      |
| `GET`    | `/api/orders`           | سجل طلباتي                       |
| `GET`    | `/api/orders/{id}`      | تفاصيل طلب معين                  |
| `DELETE` | `/api/orders/{id}`      | **إلغاء الطلب (يسترجع المخزون)** |

### لوحة التحكم (Dashboard)

_ملاحظة: لرفع الصور استخدم Body نوع `form-data`_

| الطريقة  | الرابط                 | الوصف                             |
| :------- | :--------------------- | :-------------------------------- |
| `POST`   | `/api/categories`      | إضافة قسم                         |
| `PUT`    | `/api/categories/{id}` | تعديل قسم                         |
| `DELETE` | `/api/categories/{id}` | حذف قسم                           |
| `POST`   | `/api/products`        | إضافة منتج + صورة                 |
| `POST`   | `/api/products/{id}`   | تعديل منتج (مع `_method=PUT`)     |
| `DELETE` | `/api/products/{id}`   | حذف منتج (يحذف الصورة من السيرفر) |

## التثبيت والتشغيل (Local Setup)

### 1. نسخ المشروع:

```bash
git clone <your-repo-url>
cd ECommerce-API
composer install
```

### 2. إعداد البيئة:

```bash
cp .env.example .env
php artisan key:generate
```

_(قم بضبط إعدادات قاعدة البيانات في ملف `.env`)_

### 3. ربط التخزين (خطوة إجبارية للصور):

```bash
php artisan storage:link
```

### 4. بناء الجداول والبيانات الوهمية:

```bash
php artisan migrate --seed
```

_سيقوم هذا الأمر بإنشاء منتجات وأقسام للتجربة فوراً._

### 5. تشغيل السيرفر:

```bash
php artisan serve
```

## سيناريو اختبار قوة النظام (Test Scenario)

للتأكد من عمل الـ Transactions بشكل صحيح:

1. اختر منتجاً كميته `5`.
2. حاول طلب كمية `10` → النظام سيرفض العملية بالكامل.
3. اطلب كمية `2` → النظام سيقبل ويصبح المخزون `3`.
4. قم بإلغاء الطلب (`DELETE`) → سيعود المخزون تلقائياً إلى `5`.

## الترخيص

هذا المشروع مرخص تحت [ترخيص MIT](https://opensource.org/licenses/MIT).

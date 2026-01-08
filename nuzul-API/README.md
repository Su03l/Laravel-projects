# Nuzul API (نظام حجوزات مشابه لـ Gathern)

نظام خلفي (Backend) احترافي لحجز الوحدات السكنية (شاليهات، استراحات، مخيمات). يحاكي منطق عمل التطبيقات العالمية مثل Airbnb و Gathern، حيث يربط بين المضيفين (Hosts) والضيوف (Guests) مع إدارة ذكية جداً للتواريخ والأسعار.

---

## المميزات الرئيسية (Key Features)

1.  **نظام مستخدمين مرن:**

    -   حساب واحد يمكنه العمل كمضيف (يؤجر عقاراته) وكضيف (يستأجر عقارات الآخرين).
    -   إدارة الملف الشخصي (تحديث الصورة، الجوال، النبذة).

2.  **محرك التوافر (Availability Engine):**

    -   خوارزمية ذكية تمنع تداخل الحجوزات (Double Booking Protection).
    -   لا يسمح بالحجز إذا كان التاريخ يتعارض ولو ليوم واحد مع حجز سابق.

3.  **البحث المتقدم (Smart Search):**

    -   البحث عن الشاليهات المتاحة في نطاق زمني محدد (Date Range Filter).
    -   يقوم النظام باستبعاد الشاليهات المحجوزة تلقائياً من نتائج البحث.

4.  **سياسة الإلغاء والتعديل (Cancellation Policy):**
    -   **قبل 48 ساعة:** يسمح للضيف بتعديل التواريخ أو إلغاء الحجز مجاناً.
    -   **أقل من 48 ساعة:** يغلق النظام إمكانية التعديل والإلغاء لضمان حق المضيف.

---

## التقنيات المستخدمة (Tech Stack)

-   **Framework:** Laravel 11
-   **Language:** PHP 8.2+
-   **Database:** SQLite
-   **Authentication:** Laravel Sanctum (Token Based)
-   **Date Handling:** Carbon
-   **API Resources:** JSON Formatting

---

## طريقة التثبيت والتشغيل (Installation)

### 1. استنساخ المشروع

```bash
git clone https://github.com/your-username/mabeet-api.git
cd mabeet-api
```

### 2. تثبيت المكتبات

```bash
composer install
```

### 3. إعداد البيئة

قم بنسخ ملف البيئة وتوليد مفتاح التشفير:

```bash
cp .env.example .env
php artisan key:generate
```

(تأكد من إعداد `DB_CONNECTION=sqlite` في ملف `.env`)

```bash
touch database/database.sqlite
php artisan migrate:fresh --seed
```

### 4. تشغيل السيرفر

```bash
php artisan serve
```

سيعمل المشروع على: `http://127.0.0.1:8000`

---

## بيانات التجربة (Testing Credentials)

يأتي المشروع مزوداً ببيانات وهمية جاهزة للتجربة فوراً:

**حساب المضيف (Host):**

-   Email: `host@gmail.com`
-   Password: `password`

**حساب الضيف (Guest):**

-   Email: `guest@gmail.com`
-   Password: `password`

---

## دليل الروابط (API Endpoints)

### المصادقة (Auth)

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | إنشاء حساب جديد           |
| POST   | `/api/auth/login`    | تسجيل الدخول              |
| POST   | `/api/auth/logout`   | تسجيل الخروج (يحتاج توكن) |

### الملف الشخصي (Profile)

| Method | Endpoint       | Description                       |
| ------ | -------------- | --------------------------------- |
| GET    | `/api/profile` | عرض بيانات المستخدم الحالي        |
| PUT    | `/api/profile` | تحديث البيانات (صورة، جوال، نبذة) |

### الوحدات السكنية (Listings)

| Method | Endpoint             | Description                                            |
| ------ | -------------------- | ------------------------------------------------------ |
| GET    | `/api/listings`      | عرض الكل (يدعم `?city=` و `?from_date=` و `?to_date=`) |
| GET    | `/api/listings/{id}` | عرض تفاصيل شاليه                                       |
| POST   | `/api/listings`      | (مضيف) إضافة شاليه جديد                                |
| PUT    | `/api/listings/{id}` | (مضيف) تعديل بيانات شاليه                              |
| DELETE | `/api/listings/{id}` | (مضيف) حذف شاليه                                       |

### الحجوزات (Bookings)

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| GET    | `/api/bookings`             | عرض حجوزاتي السابقة والقادمة         |
| POST   | `/api/bookings`             | إنشاء حجز جديد                       |
| PUT    | `/api/bookings/{id}`        | تعديل تاريخ الحجز (مشروط بـ 48 ساعة) |
| POST   | `/api/bookings/{id}/cancel` | إلغاء الحجز (مشروط بـ 48 ساعة)       |

---

## ملاحظات هامة

-   عند إرسال طلبات POST أو PUT، تأكد من ضبط الهيدر:

    ```
    Accept: application/json
    Content-Type: application/json
    ```

-   تنسيق التاريخ المعتمد هو `YYYY-MM-DD` (مثال: `2026-05-20`).

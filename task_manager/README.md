# Task Manager API (نظام إدارة المهام والمشاريع)

واجهة برمجية متكاملة (RESTful API) مبنية باستخدام إطار عمل Laravel. النظام مصمم ليحاكي بيئة العمل الحقيقية في الشركات (Production Ready)، حيث يتيح للمستخدمين التسجيل وإنشاء "مشاريع" خاصة بهم، وداخل كل مشروع يمكنهم إضافة "مهام" متعددة، مع إمكانية رفع الصور للمهام، وفلترة البيانات وترتيبها، كل ذلك ضمن بيئة آمنة تضمن خصوصية بيانات كل مستخدم.

---

## المميزات الرئيسية (Key Features)

1.  **نظام حماية ومصادقة (Authentication):**

    -   استخدام Laravel Sanctum لإدارة الرموز (Tokens).
    -   دعم الدخول باستخدام البريد الإلكتروني أو اسم المستخدم.
    -   تسجيل خروج آمن بحذف التوكن الحالي.

2.  **سياسات أمان صارمة (Authorization Policies):**

    -   لا يمكن لأي مستخدم رؤية أو تعديل أو حذف مشاريع أو مهام لا يملكها.
    -   تم استخدام Laravel Policies لضمان الحماية في كل العمليات (CRUD).

3.  **إدارة المرفقات والوسائط (Media Library):**

    -   دعم رفع الصور وربطها بالمهام باستخدام مكتبة Spatie Media Library.
    -   يتم تخزين الصور وتنظيمها وعرض روابطها تلقائياً في الـ API.

4.  **فلترة وبحث ذكي (Advanced Filtering):**

    -   إمكانية البحث عن المهام حسب (العنوان، الحالة، الأولوية، المشروع).
    -   إمكانية ترتيب النتائج (Sorting) حسب التاريخ أو الأولوية.
    -   استخدام مكتبة Spatie Query Builder.

5.  **الأتمتة الذكية (Observers):**

    -   فور تسجيل أي مستخدم جديد، يقوم النظام تلقائياً بإنشاء "مشروع تجريبي" يحتوي على مهام تعليمية لتعريف المستخدم بالنظام (Onboarding).

6.  **أداء عالي وهيكلية نظيفة:**

    -   استخدام API Resources لتوحيد شكل البيانات (JSON).
    -   استخدام Pagination لتقسيم البيانات وعدم تحميل السيرفر فوق طاقته.

---

## التقنيات المستخدمة (Tech Stack)

-   **Framework:** Laravel Framework (PHP)
-   **Database:** MySQL
-   **Authentication:** Laravel Sanctum
-   **Media Management:** Spatie Laravel Media Library
-   **Filtering & Search:** Spatie Laravel Query Builder

---

## طريقة التثبيت والتشغيل (Installation)

### 1. استنساخ المشروع

```bash
git clone <رابط-المشروع-الخاص-بك>
cd task_manager
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

ثم افتح ملف `.env` وعدل بيانات قاعدة البيانات (`DB_DATABASE`, `DB_USERNAME`, ...).

### 4. إعداد قاعدة البيانات

نقوم بإنشاء الجداول وزراعة البيانات الوهمية للتجربة:

```bash
php artisan migrate:fresh --seed
```

(هذا الأمر سينشئ لك حساب Admin جاهز: `admin@admin.com` / `password`)

### 5. ربط التخزين

خطوة مهمة جداً لكي تظهر الصور المرفوعة:

```bash
php artisan storage:link
```

### 6. تشغيل السيرفر

```bash
php artisan serve
```

سيعمل المشروع على: `http://127.0.0.1:8000/api/v1`

---

## دليل الروابط (API Endpoints)

جميع الروابط تبدأ بـ: `/api/v1`

### المصادقة (Auth)

| Method | Endpoint         | Description     | Required Body                                                           |
| ------ | ---------------- | --------------- | ----------------------------------------------------------------------- |
| POST   | `/auth/register` | تسجيل حساب جديد | first_name, last_name, username, email, password, password_confirmation |
| POST   | `/auth/login`    | تسجيل دخول      | identifier (ايميل أو يوزرنيم), password                                 |
| POST   | `/auth/logout`   | تسجيل خروج      | (يتطلب Token في الهيدر)                                                 |

### المستخدم (User)

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | `/user/profile`         | عرض بيانات المستخدم    |
| PUT    | `/user/update`          | تحديث البيانات الشخصية |
| POST   | `/user/change-password` | تغيير كلمة المرور      |

### المشاريع (Projects)

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| GET    | `/projects`      | عرض كل المشاريع (يدعم الفلترة)  |
| POST   | `/projects`      | إنشاء مشروع جديد                |
| GET    | `/projects/{id}` | عرض تفاصيل مشروع محدد           |
| PUT    | `/projects/{id}` | تعديل مشروع                     |
| DELETE | `/projects/{id}` | حذف مشروع (يحذف مهامه تلقائياً) |

### المهام (Tasks)

| Method | Endpoint      | Description   | Notes                                |
| ------ | ------------- | ------------- | ------------------------------------ |
| GET    | `/tasks`      | عرض كل المهام | يدعم الفلترة: `?filter[status]=done` |
| POST   | `/tasks`      | إضافة مهمة    | project_id, title, image (اختياري)   |
| GET    | `/tasks/{id}` | عرض مهمة      | يعيد رابط الصورة إن وجدت             |
| PUT    | `/tasks/{id}` | تعديل مهمة    | -                                    |
| DELETE | `/tasks/{id}` | حذف مهمة      | -                                    |

---

## أمثلة الفلترة (Filtering Examples)

```bash
# جلب المهام المنتهية فقط
GET /tasks?filter[status]=done

# جلب المهام ذات الأولوية العالية
GET /tasks?filter[priority]=high

# ترتيب المهام حسب الأحدث
GET /tasks?sort=-created_at

# بحث عن المشاريع بعنوان معين
GET /projects?filter[title]=MyProject
```

---

## ملاحظات هامة

-   عند إرسال طلبات POST أو PUT، تأكد من ضبط الهيدر:

    ```
    Accept: application/json
    Content-Type: application/json
    Authorization: Bearer {your-token}
    ```

-   جميع العمليات على المشاريع والمهام تتطلب توكن صالح.

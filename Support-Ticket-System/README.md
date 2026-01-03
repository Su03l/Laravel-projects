# نظام إدارة تذاكر الدعم الفني (Smart Support Ticket API)

نظام خلفي (Backend) متكامل لإدارة طلبات الدعم الفني، مبني باستخدام **Laravel**. يهدف المشروع إلى محاكاة بيئة العمل المؤسسية (Enterprise Environment) من خلال التركيز على أمن البيانات، فصل الصلاحيات، واستخدام علاقات قواعد البيانات المتقدمة لتقليل التكرار.

## أبرز المميزات التقنية (Core Features)

### 1. تعدد الأشكال (Polymorphic Relationships)

بدلاً من إنشاء جداول متعددة للمرفقات (مثل `ticket_images`, `reply_files`)، تم تصميم نظام مرفقات مركزي وذكي:

-   جدول واحد `attachments` يخدم النظام بالكامل.
-   يمكن إرفاق الملفات مع **التذاكر** أو **الردود** ديناميكياً باستخدام علاقة `MorphMany`.
-   هذا التصميم يجعل النظام قابلاً للتوسع مستقبلاً (مثلاً: إضافة صور للملف الشخصي دون إنشاء جداول جديدة).

### 2. الصلاحيات والأدوار (RBAC & Scoping)

النظام ذكي في التعامل مع البيانات بناءً على هوية المستخدم:

-   **المستخدم العادي:** يرى فقط التذاكر الخاصة به (Global Scope Logic).
-   **المشرف (Admin):** يمتلك صلاحية الوصول لجميع التذاكر، إدارة المستخدمين، وتعديل حالات التذاكر.
-   **الحماية:** منع المستخدمين من الوصول لتذاكر غيرهم حتى عبر الروابط المباشرة (IDOR Protection).

### 3. منطق الأعمال المؤتمت (Automated Logic)

-   **تتبع الحالة:** تتحول حالة التذكرة تلقائياً إلى `In Progress` بمجرد رد المشرف عليها.
-   **توليد المعرفات:** إنشاء رقم مرجعي فريد لكل تذكرة (مثل `TCK-X9YB2`) تلقائياً عند الإنشاء.

### 4. كود نظيف وقابل للصيانة (Clean Architecture)

-   **Request Classes:** فصل منطق التحقق (Validation) عن الكنترولر.
-   **API Resources:** تنسيق مخرجات JSON لضمان توحيد شكل البيانات وإخفاء الحقول الحساسة.
-   **Enums:** استخدام PHP Enums لضبط حالات التذاكر والأولويات (Type Safety).

---

## التقنيات المستخدمة (Tech Stack)

-   **Framework:** Laravel 11
-   **Language:** PHP 8.2+
-   **Database:** SQLite
-   **Authentication:** Laravel Sanctum
-   **Architecture:** RESTful API
-   **Tools:** Postman, Git, Scramble

---

## هيكلة قاعدة البيانات (Database Schema)

-   **Users:** (id, name, email, password, role [admin/user])
-   **Tickets:** (id, uuid, user_id, title, status, priority)
-   **Replies:** (id, ticket_id, user_id, message)
-   **Attachments:** (id, file*path, attachable_id, attachable_type) -> \_Polymorphic*

---

## دليل الروابط (API Endpoints)

### 1. المصادقة (Auth)

| Method | Endpoint        | الوصف                          |
| :----- | :-------------- | :----------------------------- |
| `POST` | `/api/login`    | تسجيل الدخول والحصول على Token |
| `POST` | `/api/register` | إنشاء حساب جديد                |
| `POST` | `/api/logout`   | تسجيل الخروج وحذف التوكن       |

### 2. التذاكر (Tickets)

| Method | Endpoint            | الوصف                                 |
| :----- | :------------------ | :------------------------------------ |
| `GET`  | `/api/tickets`      | عرض التذاكر (فلترة تلقائية حسب الدور) |
| `POST` | `/api/tickets`      | إنشاء تذكرة (يدعم رفع الملفات)        |
| `GET`  | `/api/tickets/{id}` | عرض تفاصيل تذكرة مع المرفقات          |
| `PUT`  | `/api/tickets/{id}` | تحديث الحالة (للأدمن) أو التفاصيل     |

### 3. الردود والمرفقات (Replies)

| Method | Endpoint                | الوصف                            |
| :----- | :---------------------- | :------------------------------- |
| `GET`  | `/tickets/{id}/replies` | عرض المحادثة داخل التذكرة        |
| `POST` | `/tickets/{id}/replies` | إضافة رد جديد (يدعم رفع الملفات) |

### 4. لوحة تحكم المشرف (Admin Dashboard)

| Method   | Endpoint          | الوصف                            |
| :------- | :---------------- | :------------------------------- |
| `GET`    | `/api/users`      | عرض جميع المستخدمين والبحث عنهم  |
| `POST`   | `/api/users`      | إضافة موظف أو مستخدم جديد        |
| `PUT`    | `/api/users/{id}` | تعديل بيانات وصلاحيات المستخدمين |
| `DELETE` | `/api/users/{id}` | حذف مستخدم                       |

---

## طريقة التثبيت والتشغيل (Installation)

1. **نسخ المستودع:**

    ```bash
    git clone https://github.com/your-username/support-ticket-system.git
    ```

2. **تثبيت الحزم:**

    ```bash
    composer install
    ```

3. **إعداد البيئة:**

    - قم بنسخ ملف `.env.example` إلى `.env`.
    - قم بإعداد اتصال قاعدة البيانات.

4. **ربط التخزين (للمرفقات):**

    ```bash
    php artisan storage:link
    ```

5. **تجهيز قاعدة البيانات:**

    ```bash
    php artisan migrate
    ```

6. **تشغيل السيرفر:**
    ```bash
    php artisan serve
    ```

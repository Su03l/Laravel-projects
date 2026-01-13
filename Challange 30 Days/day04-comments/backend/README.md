# نظام التعليقات الشامل (Universal Comments API)

## اسم الفكرة

نظام إدارة محتوى مع تعليقات متعددة الأشكال (Polymorphic)

## شرح تفصيلي للفكرة

هذا هو المشروع الرابع في تحدي "30 يوم 30 مشروع". المشروع عبارة عن نظام "Backend-End" متكامل لمنصة محتوى.

يحتوي النظام على إدارة للمقالات والفيديوهات، ولكن الميزة الأقوى هي نظام التعليقات الذكي (Polymorphic Relationships). بدلاً من تكرار جداول التعليقات، نستخدم جدولاً واحداً (comments) يرتبط ديناميكياً بأي محتوى (سواء كان مقالاً أو فيديو) بناءً على النوع (post أو video).

## المميزات بالتفصيل المملي

### إدارة كاملة للمحتوى (CRUD):

-   API كامل لإدارة المقالات (Posts).
-   API كامل لإدارة الفيديوهات (Videos).
-   عند طلب عرض مقال أو فيديو، يتم جلب التعليقات المرتبطة به تلقائياً (Eager Loading).

### جدول تعليقات واحد للجميع (The Joker):

-   استخدام تقنية MorphMany لربط جدول التعليقات بجدولي المقالات والفيديوهات.
-   النظام يخزن commentable_type و commentable_id للتمييز بين التعليقات.

### كنترولر تعليقات ذكي:

-   يستقبل الطلب ويحدد نوع المودل (App\Models\Post أو App\Models\Video) تلقائياً ويربط التعليق به.

### جاهز للفرونت إند (React/Vue):

-   تم تعطيل حماية CSRF (validateCsrfTokens) لتسهيل الربط مع تطبيقات SPA الخارجية.
-   الردود موحدة بصيغة JSON.

## التقنيات المستخدمة

-   **الإطار البرمجي**: Laravel 11 (API Mode)
-   **قاعدة البيانات**: SQLite
-   **نوع العلاقة**: Polymorphic (MorphMany & MorphTo)
-   **التوثيق**: Dedoc Scramble

## جدول الروابط (API Routes)

| الطريقة | الرابط             | الوصف                          | البيانات المطلوبة (JSON Body) |
| ------- | ------------------ | ------------------------------ | ----------------------------- |
| GET     | /api/posts         | عرض كل المقالات مع تعليقاتها   | -                             |
| POST    | /api/posts         | إنشاء مقال                     | title, content                |
| GET     | /api/posts/{id}    | عرض مقال واحد                  | -                             |
| PUT     | /api/posts/{id}    | تعديل مقال                     | title, content                |
| DELETE  | /api/posts/{id}    | حذف مقال                       | -                             |
| GET     | /api/videos        | عرض كل الفيديوهات مع تعليقاتها | -                             |
| POST    | /api/videos        | إنشاء فيديو                    | title, url                    |
| PUT     | /api/videos/{id}   | تعديل فيديو                    | title, url                    |
| DELETE  | /api/videos/{id}   | حذف فيديو                      | -                             |
| GET     | /api/comments      | عرض كل التعليقات (Admin)       | -                             |
| POST    | /api/comments      | إضافة تعليق                    | body, type (post/video), id   |
| DELETE  | /api/comments/{id} | حذف تعليق                      | -                             |

### مثال JSON لإضافة تعليق:

```json
{
    "body": "شرح ممتاز جدا!",
    "type": "post",
    "id": 1
}
```

## طريقة التنزيل والتثبيت

### 1. استنساخ المشروع:

```bash
git clone <repository_link>
cd day04-comments
```

### 2. تثبيت الحزم:

```bash
composer install
```

### 3. إعداد البيئة وقاعدة البيانات:

```bash
cp .env.example .env
touch database/database.sqlite
# (تأكد من DB_CONNECTION=sqlite)
```

### 4. تعطيل CSRF (لأغراض التطوير مع React):

تأكد من إضافة `$middleware->validateCsrfTokens(except: ['*']);` في ملف `bootstrap/app.php`.

### 5. بناء الجداول وتعبئة البيانات:

```bash
php artisan migrate:fresh --seed
```

### 6. تشغيل السيرفر:

```bash
php artisan serve
```

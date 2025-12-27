# واجهة برمجة تطبيقات النظام الجامعي

واجهة برمجة تطبيقات RESTful بسيطة لإدارة عمليات الجامعة بما في ذلك الطلاب والمواد الدراسية، مبنية باستخدام Laravel.

## المميزات

-   **عمليات CRUD**: إنشاء، قراءة، تحديث، وحذف الطلاب والمواد الدراسية.
-   **إدارة المواد**: إدارة المواد الدراسية بإمكانيات CRUD كاملة.
-   **إدارة الطلاب**: إدارة سجلات الطلاب مع التسجيل في المواد.
-   **تسجيل المواد**: تسجيل الطلاب في المواد وإدارة الالتحاقات.
-   **التحقق من الصحة**: تحقق قوي من صحة البيانات المدخلة (مثل الحقول المطلوبة، سلامة البيانات).
-   **موارد API**: استخدام موارد Laravel API للحصول على استجابات JSON متسقة.

## التقنيات المستخدمة

-   **Laravel**: إطار عمل PHP المستخدم لبناء الواجهة.
-   **SQLite**: قاعدة البيانات المستخدمة لتخزين معلومات الجامعة.
-   **PHP**: لغة البرمجة من جانب الخادم.

## نقاط النهاية (API Endpoints)

### الطلاب

#### 1. عرض جميع الطلاب

-   **URL**: `/api/students`
-   **Method**: `GET`
-   **الوصف**: يسترجع قائمة بجميع الطلاب.

#### 2. إنشاء طالب

-   **URL**: `/api/students`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "name": "Jane Smith",
        "email": "jane@university.edu",
        "student_id": "STU123456",
        "major": "Computer Science"
    }
    ```
-   **الوصف**: إضافة طالب جديد إلى النظام.

#### 3. عرض طالب واحد

-   **URL**: `/api/students/{id}`
-   **Method**: `GET`
-   **الوصف**: يسترجع تفاصيل طالب معين بواسطة المعرف.

#### 4. تحديث طالب

-   **URL**: `/api/students/{id}`
-   **Method**: `PUT` or `PATCH`
-   **Body**:
    ```json
    {
        "name": "Jane Smith Updated",
        "email": "jane.updated@university.edu",
        "student_id": "STU123456",
        "major": "Software Engineering"
    }
    ```
-   **الوصف**: تحديث طالب موجود.

#### 5. حذف طالب

-   **URL**: `/api/students/{id}`
-   **Method**: `DELETE`
-   **الوصف**: إزالة طالب من النظام.

#### 6. تسجيل طالب في مادة

-   **URL**: `/api/students/{student}/courses`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "course_id": 1
    }
    ```
-   **الوصف**: تسجيل طالب في مادة محددة.

#### 7. إلغاء تسجيل المادة

-   **URL**: `/api/students/{student}/courses`
-   **Method**: `DELETE`
-   **Body**:
    ```json
    {
        "course_id": 1
    }
    ```
-   **الوصف**: إلغاء تسجيل طالب في مادة.

### المواد الدراسية

#### 1. عرض جميع المواد

-   **URL**: `/api/courses`
-   **Method**: `GET`
-   **الوصف**: يسترجع قائمة بجميع المواد الدراسية.

#### 2. إنشاء مادة

-   **URL**: `/api/courses`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "name": "Introduction to Programming",
        "code": "CS101",
        "credits": 3,
        "description": "Basic programming concepts"
    }
    ```
-   **الوصف**: إضافة مادة جديدة إلى النظام.

#### 3. عرض مادة واحدة

-   **URL**: `/api/courses/{id}`
-   **Method**: `GET`
-   **الوصف**: يسترجع تفاصيل مادة معينة بواسطة المعرف.

#### 4. تحديث مادة

-   **URL**: `/api/courses/{id}`
-   **Method**: `PUT` or `PATCH`
-   **Body**:
    ```json
    {
        "name": "Advanced Programming",
        "code": "CS102",
        "credits": 4,
        "description": "Advanced programming concepts"
    }
    ```
-   **الوصف**: تحديث مادة موجودة.

#### 5. حذف مادة

-   **URL**: `/api/courses/{id}`
-   **Method**: `DELETE`
-   **الوصف**: إزالة مادة من النظام.

## التثبيت

1. استنساخ المستودع:
    ```bash
    git clone <repository-url>
    ```
2. تثبيت الحزم:
    ```bash
    composer install
    ```
3. نسخ `.env.example` إلى `.env` وتكوين إعدادات قاعدة البيانات:
    ```bash
    cp .env.example .env
    ```
4. توليد مفتاح التطبيق:
    ```bash
    php artisan key:generate
    ```
5. تشغيل الهجرات:
    ```bash
    php artisan migrate
    ```
6. تشغيل التطبيق:
    ```bash
    php artisan serve
    ```

## الترخيص

هذا المشروع مرخص تحت [ترخيص MIT](https://opensource.org/licenses/MIT).

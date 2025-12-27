# واجهة برمجة تطبيقات نظام الموارد البشرية

واجهة برمجة تطبيقات RESTful بسيطة لإدارة عمليات الموارد البشرية بما في ذلك الموظفين والأقسام، مبنية باستخدام Laravel.

## المميزات

-   **عمليات CRUD**: إنشاء، قراءة، تحديث، وحذف الموظفين والأقسام.
-   **إدارة الأقسام**: إدارة أقسام المنظمة بإمكانيات CRUD كاملة.
-   **إدارة الموظفين**: إدارة سجلات الموظفين مع ربطهم بالأقسام.
-   **التحقق من الصحة**: تحقق قوي من صحة البيانات المدخلة (مثل الحقول المطلوبة، سلامة البيانات).
-   **موارد API**: استخدام موارد Laravel API للحصول على استجابات JSON متسقة.

## التقنيات المستخدمة

-   **Laravel**: إطار عمل PHP المستخدم لبناء الواجهة.
-   **SQLite**: قاعدة البيانات المستخدمة لتخزين معلومات الموارد البشرية.
-   **PHP**: لغة البرمجة من جانب الخادم.

## نقاط النهاية (API Endpoints)

### الأقسام

#### 1. عرض جميع الأقسام

-   **URL**: `/api/departments`
-   **Method**: `GET`
-   **الوصف**: يسترجع قائمة بجميع الأقسام.

#### 2. إنشاء قسم

-   **URL**: `/api/departments`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "name": "IT Department",
        "description": "Information Technology"
    }
    ```
-   **الوصف**: إضافة قسم جديد إلى النظام.

#### 3. عرض قسم واحد

-   **URL**: `/api/departments/{id}`
-   **Method**: `GET`
-   **الوصف**: يسترجع تفاصيل قسم معين بواسطة المعرف.

#### 4. تحديث قسم

-   **URL**: `/api/departments/{id}`
-   **Method**: `PUT` or `PATCH`
-   **Body**:
    ```json
    {
        "name": "Updated IT Department",
        "description": "Updated Description"
    }
    ```
-   **الوصف**: تحديث قسم موجود.

#### 5. حذف قسم

-   **URL**: `/api/departments/{id}`
-   **Method**: `DELETE`
-   **الوصف**: إزالة قسم من النظام.

### الموظفون

#### 1. عرض جميع الموظفين

-   **URL**: `/api/employees`
-   **Method**: `GET`
-   **الوصف**: يسترجع قائمة بجميع الموظفين.

#### 2. إنشاء موظف

-   **URL**: `/api/employees`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "name": "John Doe",
        "email": "john@example.com",
        "position": "Software Engineer",
        "department_id": 1
    }
    ```
-   **الوصف**: إضافة موظف جديد إلى النظام.

#### 3. عرض موظف واحد

-   **URL**: `/api/employees/{id}`
-   **Method**: `GET`
-   **الوصف**: يسترجع تفاصيل موظف معين بواسطة المعرف.

#### 4. تحديث موظف

-   **URL**: `/api/employees/{id}`
-   **Method**: `PUT` or `PATCH`
-   **Body**:
    ```json
    {
        "name": "John Doe Updated",
        "email": "john.updated@example.com",
        "position": "Senior Software Engineer",
        "department_id": 2
    }
    ```
-   **الوصف**: تحديث موظف موجود.

#### 5. حذف موظف

-   **URL**: `/api/employees/{id}`
-   **Method**: `DELETE`
-   **الوصف**: إزالة موظف من النظام.

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

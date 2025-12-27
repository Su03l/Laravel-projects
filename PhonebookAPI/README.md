# واجهة برمجة تطبيقات دفتر الهاتف

واجهة برمجة تطبيقات RESTful بسيطة لإدارة جهات الاتصال الهاتفية، مبنية باستخدام Laravel.

## المميزات

-   **عمليات CRUD**: إنشاء، قراءة، تحديث، وحذف جهات الاتصال.
-   **البحث**: البحث عن جهات الاتصال برقم الهاتف.
-   **التحقق من الصحة**: تحقق قوي من صحة البيانات المدخلة (مثل أرقام هواتف فريدة، حقول مطلوبة).
-   **موارد API**: استخدام موارد Laravel API للحصول على استجابات JSON متسقة.

## التقنيات المستخدمة

-   **Laravel**: إطار عمل PHP المستخدم لبناء الواجهة.
-   **SQLite**: قاعدة البيانات المستخدمة لتخزين معلومات جهات الاتصال.
-   **PHP**: لغة البرمجة من جانب الخادم.

## نقاط النهاية (API Endpoints)

### 1. عرض جميع جهات الاتصال

-   **URL**: `/api/phonenumbers`
-   **Method**: `GET`
-   **الوصف**: يسترجع قائمة بجميع جهات الاتصال.

### 2. إنشاء جهة اتصال

-   **URL**: `/api/phonenumbers`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "name": "John Doe",
        "number": "1234567890",
        "email": "john@example.com",
        "relation": "Friend"
    }
    ```
-   **الوصف**: إضافة جهة اتصال جديدة إلى دفتر الهاتف.

### 3. عرض جهة اتصال واحدة

-   **URL**: `/api/phonenumbers/{id}`
-   **Method**: `GET`
-   **الوصف**: يسترجع تفاصيل جهة اتصال معينة بواسطة المعرف.

### 4. تحديث جهة اتصال

-   **URL**: `/api/phonenumbers/{id}`
-   **Method**: `PUT` or `PATCH`
-   **Body**:
    ```json
    {
        "name": "John Doe Updated",
        "number": "0987654321",
        "email": "john.updated@example.com",
        "relation": "Family"
    }
    ```
-   **الوصف**: تحديث جهة اتصال موجودة.

### 5. حذف جهة اتصال

-   **URL**: `/api/phonenumbers/{id}`
-   **Method**: `DELETE`
-   **الوصف**: إزالة جهة اتصال من دفتر الهاتف.

### 6. البحث برقم الهاتف

-   **URL**: `/api/phonenumbers/search/{number}`
-   **Method**: `GET`
-   **الوصف**: البحث عن جهة اتصال برقم الهاتف.

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

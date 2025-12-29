# نظام إدارة العقارات والبحث المتقدم (Real Estate API)

نظام API مرن لإدارة العقارات مبني باستخدام **Laravel**، يركز بشكل أساسي على **نطاقات الاستعلام (Query Scopes)** و **الفلترة الديناميكية (Dynamic Filtering)**. يتيح للمستخدمين البحث عن العقارات بناءً على معايير متعددة ومعقدة (المدينة، نطاق السعر، المساحة التقريبية، وغيرها) بكفاءة عالية ومن خلال نقطة وصول واحدة.

## أبرز المميزات

-   **محرك بحث متقدم:** فلترة النتائج حسب المدينة، النوع، الحالة، السعر، والمزيد باستخدام Endpoint واحد فقط.
-   **سكوبات ذكية (Smart Scopes):** استخدام `Local Scopes` داخل المودل للحفاظ على نظافة الكنترولر وقابليته للصيانة.
-   **البحث التقريبي (Fuzzy Search):** منطق ذكي للبحث عن المساحة بنطاق تسامح (±20 متر)، لضمان عدم فقدان النتائج القريبة.
-   **التحقق والتوثيق:** استخدام `FormRequest` لضمان صحة المدخلات وتوليد توثيق تلقائي للحقول في أدوات مثل Scramble.
-   **حل تعارض الروابط:** معالجة مشكلة الأولوية بين الروابط المخصصة (`/search`) وروابط الموارد القياسية (`/{id}`).

## التقنيات المستخدمة

-   **Laravel 10/11**
-   **Eloquent ORM** (Builder & Scopes)
-   **SQLite**
-   **API Resources**
-   **Scramble** (API Documentation)

## نقاط الوصول (API Endpoints)

### البحث المتقدم (Advanced Search)

**GET** `/api/properties/search`

يسمح هذا الرابط بفلترة البيانات بأي مزيج من المعايير التالية:

| المعامل (Parameter) | النوع     | الوصف                                     |
| :------------------ | :-------- | :---------------------------------------- |
| `city`              | `string`  | اسم المدينة (مثال: Riyadh)                |
| `type`              | `string`  | نوع العقار (`apartment`, `villa`, `land`) |
| `status`            | `string`  | حالة العقار (`sale`, `rent`)              |
| `min_price`         | `number`  | الحد الأدنى للسعر                         |
| `max_price`         | `number`  | الحد الأعلى للسعر                         |
| `rooms`             | `integer` | الحد الأدنى لعدد الغرف                    |
| `area`              | `integer` | المساحة المطلوبة (يبحث في نطاق ±20 متر)   |

**مثال للطلب:**

```http
GET /api/properties/search?city=Jeddah&type=villa&max_price=2000000&area=400
```

### إدارة العقارات (CRUD)

العمليات الأساسية للإضافة والتعديل والحذف.

| الطريقة | الرابط                   | الوصف                                    |
| :------ | :----------------------- | :--------------------------------------- |
| GET     | `/api/properties/search` | البحث المتقدم في العقارات                |
| GET     | `/api/properties`        | عرض جميع العقارات (مع التصفح Pagination) |
| POST    | `/api/properties`        | إضافة عقار جديد                          |
| GET     | `/api/properties/{id}`   | عرض تفاصيل عقار محدد                     |
| PUT     | `/api/properties/{id}`   | تعديل بيانات العقار                      |
| DELETE  | `/api/properties/{id}`   | حذف العقار                               |

## التثبيت والتشغيل

نسخ المستودع:

```bash
git clone <repo-url>
composer install
```

إعداد البيئة:

```bash
cp .env.example .env
php artisan key:generate
```

إنشاء ملف قاعدة البيانات SQLite:

```bash
touch database/database.sqlite
```

أو في Windows:

```powershell
New-Item database/database.sqlite -ItemType File
```

قاعدة البيانات والبيانات الوهمية:
(سيقوم هذا الأمر بإنشاء الجدول وزراعة 100 عقار للتجربة فوراً)

```bash
php artisan migrate --seed
```

تشغيل السيرفر:

```bash
php artisan serve
```

## توثيق API (Scramble)

بعد تشغيل السيرفر، يمكنك الوصول إلى التوثيق التفاعلي لـ API عبر:

```
http://localhost:8000/docs/api
```

يوفر Scramble واجهة تفاعلية لاستكشاف جميع endpoints، معاينة المعاملات، وتجربة الطلبات مباشرة.

## الترخيص

هذا المشروع مرخص تحت ترخيص MIT.

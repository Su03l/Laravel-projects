<div align="center">

# Fleet Run API

### نظام إدارة الأسطول اللوجستي الذكي واللحظي

<p>
    <a href="#"><img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" /></a>
    <a href="#"><img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Reverb-Realtime-4F46E5?style=for-the-badge&logo=socket.io&logoColor=white" alt="Reverb" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel&logoColor=white" alt="Sanctum" /></a>
</p>

<p>
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square" alt="Status" />
    <img src="https://img.shields.io/badge/Challenge-Day_30-orange?style=flat-square" alt="Challenge" />
</p>

<br>

**Fleet Run** هو نظام لوجستي متطور لإدارة الأساطيل والشحنات. يتميز بمحرك تتبع لحظي (Real-time Engine) مبني على WebSockets، مما يسمح للمدراء بمراقبة تحركات السائقين وحالات الشحنات مباشرة على الخريطة. النظام مصمم ليكون Headless API جاهز للربط مع تطبيقات الجوال والويب.

</div>

---

## أبرز الحلول التقنية

| التحدي              | الحل الذكي في Fleet Run                                                      |
| :------------------ | :--------------------------------------------------------------------------- |
| **التتبع اللحظي**   | استخدام **Laravel Reverb** لبث إحداثيات السائقين (Live Tracking) بأقل تأخير  |
| **إثبات التوصيل**   | نظام **POD (Proof of Delivery)** يسمح برفع صور التوقيع أو التسليم وتوثيقها   |
| **إدارة الصلاحيات** | نظام **RBAC** صارم يفصل بين صلاحيات المدير (Admin)، الموظف (Dispatcher)، والسائق |
| **المحاكاة**        | أداة **Simulator** مدمجة لتحريك السائقين وهمياً لتجربة النظام قبل الإطلاق    |

<br>

## المميزات الرئيسية

<div align="center">

`Real-time Tracking` &nbsp; `Shipment Management` &nbsp; `Driver App API`
<br>
`Proof of Delivery (POD)` &nbsp; `Dashboard Stats` &nbsp; `Role-Based Access`

</div>

---

## توثيق الواجهة البرمجية (API)

يمكنك الوصول للتوثيق الكامل والتفاعلي (Swagger/Scramble) عبر الرابط `/docs/api` عند التشغيل.

### 1. المصادقة (Authentication)

| الطريقة | المسار           | الوصف                                      |
| :------ | :--------------- | :----------------------------------------- |
| `POST`  | `/api/login`     | تسجيل الدخول (للمدراء والسائقين)           |
| `POST`  | `/api/logout`    | تسجيل الخروج                               |
| `GET`   | `/api/profile`   | عرض الملف الشخصي                           |
| `PUT`   | `/api/profile`   | تحديث البيانات                             |
| `POST`  | `/api/employees` | إضافة موظف جديد (Admin Only)               |

### 2. إدارة الأسطول (Fleet Management) (Admin Only)

| الطريقة | المسار                 | الوصف                     |
| :------ | :--------------------- | :------------------------ |
| `GET`   | `/api/drivers`         | عرض قائمة السائقين        |
| `POST`  | `/api/drivers`         | إضافة سائق جديد           |
| `GET`   | `/api/vehicles`        | عرض قائمة المركبات        |
| `POST`  | `/api/vehicles`        | إضافة مركبة جديدة         |

### 3. إدارة الشحنات (Shipments)

| الطريقة | المسار                           | الوصف                                      |
| :------ | :------------------------------- | :----------------------------------------- |
| `GET`   | `/api/shipments`                 | عرض الشحنات (للمدير: الكل، للسائق: شحناته) |
| `POST`  | `/api/shipments`                 | إنشاء شحنة جديدة (Admin)                   |
| `POST`  | `/api/shipments/{id}/assign`     | إسناد شحنة لسائق (Admin)                   |
| `POST`  | `/api/shipments/{id}/status`     | تحديث حالة الشحنة                          |
| `POST`  | `/api/shipments/{id}/delivery`   | إثبات التوصيل (POD) ورفع الصورة            |

### 4. المحرك اللحظي (Real-time Engine)

| الطريقة | المسار                 | الوصف                                      |
| :------ | :--------------------- | :----------------------------------------- |
| `POST`  | `/api/driver/location` | تحديث إحداثيات السائق (يتم استدعاؤه دورياً)|
| `GET`   | `/api/dashboard/stats` | إحصائيات لوحة التحكم                       |

---

## التثبيت والتشغيل

اتبع الخطوات التالية لتشغيل النسخة المحلية:

**1. استنساخ المشروع**

```bash
git clone https://github.com/your-username/fleet-run.git
cd fleet-run
```

**2. تثبيت الاعتمادات**

```bash
composer install
```

**3. إعداد البيئة**

```bash
cp .env.example .env
php artisan key:generate
php artisan storage:link
```

**4. إعداد قاعدة البيانات**

```bash
php artisan migrate --seed
```
> **ملاحظة:** الأمر `--seed` سيقوم بإنشاء حسابات تجريبية (Admin, Driver) و 10 سائقين وهميين في الرياض.

**5. تشغيل النظام (Server & Reverb)**
تحتاج لفتح 3 نوافذ تيرمينال:

```bash
# Terminal 1: تشغيل السيرفر
php artisan serve

# Terminal 2: تشغيل سيرفر الويب سوكيت (Reverb)
php artisan reverb:start

# Terminal 3 (اختياري): تشغيل محاكي الحركة
php artisan fleet:simulate
```

---

## الحسابات التجريبية (Demo Accounts)

| الدور       | البريد الإلكتروني      | كلمة المرور |
| :---------- | :--------------------- | :---------- |
| **Admin**   | `admin@fleet.com`      | `password`  |
| **Driver**  | `driver@fleet.com`     | `password`  |

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

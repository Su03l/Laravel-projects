<div align="center">

# StayEase
### نظام إدارة الفنادق الفاخر

<p>
    <a href="#"><img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" /></a>
    <a href="#"><img src="https://img.shields.io/badge/PHP-8.4-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel&logoColor=white" alt="Sanctum" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Pest-Testing-D81B60?style=for-the-badge&logo=pest&logoColor=white" alt="Pest" /></a>
</p>

<p>
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square" alt="Status" />
    <img src="https://img.shields.io/badge/Challenge-Day_26-orange?style=flat-square" alt="Challenge" />
</p>

<br>

**StayEase** هو نظام رقمي متكامل يهدف إلى إعادة تعريف تجربة الضيافة الفندقية. يجمع النظام بين قوة الأداء وسهولة الاستخدام، موفراً حلولاً ذكية لإدارة الحجوزات، الخدمات، والعمليات التشغيلية بأعلى معايير الأمان.

</div>

---

## أبرز الحلول التقنية

| التحدي | الحل الذكي في StayEase |
| :--- | :--- |
| **تضارب الحجوزات** | محرك حجز ذكي يمنع حجز نفس الغرفة في نفس الوقت ويحسب التوفر بدقة متناهية |
| **تعقيد الأسعار** | نظام تسعير ديناميكي يدعم الباقات المتعددة والكوبونات الترويجية بمرونة عالية |
| **ضعف التواصل** | نظام تنبيهات آلي مجدول يرسل تذكيرات الخروج ورسائل الشكر والتقييم |
| **تجربة العميل** | واجهة برمجية لطلب خدمات الغرف وتقييم الإقامة وإدارة المفضلة |

<br>

## المميزات الرئيسية

<div align="center">

`Smart Booking Engine` &nbsp; `Role-Based Access Control` &nbsp; `Room Service API`
<br>
`Automated Notifications` &nbsp; `PDF Invoicing` &nbsp; `Advanced Search`

</div>

---

## توثيق الواجهة البرمجية (API)

يمكنك الوصول للتوثيق الكامل والتفاعلي عبر الرابط:
**[http://127.0.0.1:8000/docs/api](http://127.0.0.1:8000/docs/api)**

### 1. المصادقة والأمان

| الطريقة | المسار | الوصف |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | تسجيل حساب جديد |
| `POST` | `/api/auth/verify-account` | تفعيل الحساب عبر OTP |
| `POST` | `/api/auth/login` | تسجيل الدخول (يدعم 2FA) |
| `POST` | `/api/auth/login/verify` | تأكيد الدخول (2FA) |
| `POST` | `/api/auth/forgot-password` | استعادة كلمة المرور |
| `POST` | `/api/auth/reset-password` | تعيين كلمة المرور الجديدة |

### 2. إدارة الملف الشخصي

| الطريقة | المسار | الوصف |
| :--- | :--- | :--- |
| `GET` | `/api/profile` | عرض بياناتي |
| `POST` | `/api/profile/update` | تحديث البيانات |
| `POST` | `/api/profile/change-password` | تغيير كلمة المرور |
| `POST` | `/api/profile/2fa` | إعدادات المصادقة الثنائية |

### 3. الحجوزات والغرف

| الطريقة | المسار | الوصف |
| :--- | :--- | :--- |
| `GET` | `/api/rooms/search` | البحث المتقدم عن الغرف |
| `POST` | `/api/bookings` | إنشاء حجز جديد |
| `GET` | `/api/my-bookings` | عرض حجوزاتي |
| `POST` | `/api/bookings/{id}/cancel` | إلغاء الحجز (قبل 48 ساعة) |

### 4. خدمات ورفاهية

| الطريقة | المسار | الوصف |
| :--- | :--- | :--- |
| `GET` | `/api/services/menu` | عرض قائمة الخدمات |
| `POST` | `/api/services/order` | طلب خدمة للغرفة |
| `GET` | `/api/bookings/{id}/orders` | عرض طلباتي السابقة |
| `POST` | `/api/reviews` | إضافة تقييم للإقامة |
| `POST` | `/api/favorites/toggle` | إضافة/حذف من المفضلة |
| `GET` | `/api/favorites` | عرض المفضلة |

### 5. لوحة تحكم الأدمن

| الطريقة | المسار | الوصف |
| :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | عرض الإحصائيات والأرباح |
| `GET` | `/api/admin/bookings` | عرض وإدارة الحجوزات |
| `PUT` | `/api/admin/bookings/{id}/status` | تعديل حالة الحجز |
| `PUT` | `/api/admin/rooms/{id}/status` | تغيير حالة الغرفة (صيانة/متاح) |

---

## التثبيت والتشغيل

اتبع الخطوات التالية لتشغيل النسخة المحلية:

**1. استنساخ المشروع**
```bash
git clone https://github.com/your-username/stayease.git
cd stayease
```

**2. تثبيت الاعتمادات**
```bash
composer install
```

**3. إعداد البيئة**
```bash
cp .env.example .env
php artisan key:generate
```

**4. تشغيل المحاكاة الملكية**
يقوم هذا الأمر ببناء الفندق بالكامل، إنشاء 5000 عميل، ومحاكاة عمليات حجز واقعية.
```bash
php artisan migrate:fresh --seed
```

**5. التشغيل (Server, Queue & Scheduler)**
لتشغيل النظام بالكامل، ستحتاج لفتح 3 نوافذ تيرمنال:

```bash
# 1. تشغيل السيرفر
php artisan serve
# الرابط: http://127.0.0.1:8000

# 2. تشغيل معالج الصفوف (للإيميلات)
php artisan queue:work

# 3. تشغيل المجدول (للتنبيهات اليومية)
php artisan schedule:work
```

---

## الاختبارات (Testing)

نستخدم إطار العمل **Pest** لضمان جودة النظام. لتشغيل سيناريو الحجز الكامل:

```bash
php artisan test --filter=HotelFlowTest
```

---

## بيانات الدخول التجريبية

<div align="center">

| الدور | البريد الإلكتروني | كلمة المرور |
| :--- | :--- | :--- |
| **مدير النظام** | `admin@stayease.com` | `admin123` |
| **عميل** | `ahmed@stayease.com` | `password123` |

</div>

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

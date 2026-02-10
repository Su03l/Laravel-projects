<div align="center">

# GeniusLab

### منصة الذكاء الاصطناعي الشاملة لتوليد المحتوى

<p>
    <a href="#"><img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" /></a>
    <a href="#"><img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" /></a>
    <a href="#"><img src="https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Sanctum-Auth-38BDF8?style=for-the-badge&logo=laravel&logoColor=white" alt="Sanctum" /></a>
</p>

<p>
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square" alt="Status" />
    <img src="https://img.shields.io/badge/Challenge-Day_27-orange?style=flat-square" alt="Challenge" />
</p>

<br>

**GeniusLab** هو نظام ذكي متكامل يهدف إلى تمكين المستخدمين من توليد المحتوى الإبداعي باستخدام أحدث تقنيات الذكاء الاصطناعي. يجمع النظام بين القوة والمرونة، موفراً أدوات لتوليد النصوص، الصور، والصوتيات، مع نظام محفظة إلكترونية ذكي للتحكم في الاستهلاك.

</div>

---

## أبرز الحلول التقنية

| التحدي              | الحل الذكي في GeniusLab                                                      |
| :------------------ | :--------------------------------------------------------------------------- |
| **تشتت الأدوات**    | منصة موحدة تدعم توليد النصوص، الصور، والصوتيات في مكان واحد                  |
| **صعوبة التلقين**   | نظام قوالب ذكية (Templates) جاهزة لمختلف حالات الاستخدام (تسويق، برمجة، إلخ) |
| **التحكم بالتكلفة** | نظام محفظة ونقاط (Credits) دقيق يسمح بشحن رصيد وشراء باقات مخصصة             |
| **فقدان السياق**    | أرشيف محادثات متكامل مع خاصية البحث لاسترجاع أي معلومة سابقة بسهولة          |

<br>

## المميزات الرئيسية

<div align="center">

`Multi-Model AI Engine` &nbsp; `Smart Wallet System` &nbsp; `Content Templates`
<br>
`Chat History & Search` &nbsp; `2FA Security` &nbsp; `Role-Based Access`

</div>

---

## توثيق الواجهة البرمجية (API)

يمكنك الوصول للتوثيق الكامل والتفاعلي عبر الرابط عند التشغيل المحلي.

### 1. المصادقة والأمان

| الطريقة | المسار                 | الوصف                     |
| :------ | :--------------------- | :------------------------ |
| `POST`  | `/api/register`        | تسجيل حساب جديد           |
| `POST`  | `/api/verify-account`  | تفعيل الحساب عبر OTP      |
| `POST`  | `/api/login`           | تسجيل الدخول              |
| `POST`  | `/api/login/verify`    | تأكيد الدخول (2FA)        |
| `POST`  | `/api/forgot-password` | طلب استعادة كلمة المرور   |
| `POST`  | `/api/reset-password`  | تعيين كلمة المرور الجديدة |

### 2. الملف الشخصي

| الطريقة | المسار              | الوصف                         |
| :------ | :------------------ | :---------------------------- |
| `GET`   | `/api/user`         | عرض بياناتي                   |
| `PUT`   | `/api/user/profile` | تحديث البيانات                |
| `POST`  | `/api/user/2fa`     | تفعيل/تعطيل المصادقة الثنائية |

### 3. محرك الذكاء الاصطناعي (AI Engine)

| الطريقة | المسار                | الوصف                              |
| :------ | :-------------------- | :--------------------------------- |
| `GET`   | `/api/models`         | عرض نماذج الذكاء الاصطناعي المتاحة |
| `POST`  | `/api/generate`       | توليد محتوى نصي (Chat)             |
| `POST`  | `/api/generate/image` | توليد صور احترافية                 |
| `POST`  | `/api/generate/audio` | تحويل النص إلى صوت (TTS)           |

### 4. القوالب (Templates)

| الطريقة | المسار                         | الوصف                     |
| :------ | :----------------------------- | :------------------------ |
| `GET`   | `/api/templates`               | عرض مكتبة القوالب الجاهزة |
| `POST`  | `/api/templates/{id}/generate` | استخدام قالب لتوليد محتوى |

### 5. نظام المحفظة والدفع

| الطريقة | المسار                | الوصف               |
| :------ | :-------------------- | :------------------ |
| `GET`   | `/api/wallet`         | عرض تفاصيل المحفظة  |
| `GET`   | `/api/wallet/balance` | عرض الرصيد الحالي   |
| `GET`   | `/api/packages`       | استعراض باقات الشحن |
| `POST`  | `/api/purchase`       | شراء رصيد جديد      |

### 6. المحادثات والأرشيف

| الطريقة  | المسار              | الوصف                      |
| :------- | :------------------ | :------------------------- |
| `GET`    | `/api/chats`        | عرض سجل المحادثات          |
| `GET`    | `/api/chats/search` | البحث في المحادثات السابقة |
| `GET`    | `/api/chats/{id}`   | عرض تفاصيل محادثة          |
| `DELETE` | `/api/chats/{id}`   | حذف محادثة                 |

---

## التثبيت والتشغيل

اتبع الخطوات التالية لتشغيل النسخة المحلية:

**1. استنساخ المشروع**

```bash
git clone https://github.com/your-username/geniuslab.git
cd geniuslab
cd backend
```

**2. تثبيت الاعتمادات**

```bash
composer install
npm install
```

**3. إعداد البيئة**

```bash
cp .env.example .env
php artisan key:generate
```

**4. إعداد قاعدة البيانات**

```bash
php artisan migrate --seed
```

**5. التشغيل (Server & Queue)**
لتشغيل النظام بالكامل، ينصح بتشغيل السيرفر والصفوف الخلفية:

```bash
# تشغيل السيرفر
php artisan serve

# تشغيل الطابور (لمعالجة عمليات التوليد الطويلة)
php artisan queue:work
```

---

## الاختبارات (Testing)

نستخدم إطار العمل **Pest** لضمان جودة النظام.

```bash
php artisan test
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

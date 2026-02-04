# LiveChat API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![MySQL](https://img.shields.io/badge/MySQL-Database-003B57?style=for-the-badge&logo=mysql) ![Sanctum](https://img.shields.io/badge/Auth-Sanctum-38BDF8?style=for-the-badge&logo=laravel) ![Reverb](https://img.shields.io/badge/RealTime-Reverb-FF2D20?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 23**

</div>

---

## نظرة عامة

"LiveChat" هو نظام محادثة فوري متطور يتيح للمستخدمين التواصل بشكل لحظي وسلس. يوفر النظام إمكانية إنشاء محادثات فردية وجماعية، تبادل الرسائل، وتأمين المحادثات باستخدام رمز PIN، مع دعم كامل للغة العربية وتقنيات الـ Real-time باستخدام Laravel Reverb.

## المشكلات التي يحلها

| المشكلة               | الحل                                                     |
| :-------------------- | :------------------------------------------------------- |
| بطء التواصل التقليدي  | نظام محادثة فوري (Real-time) يعتمد على WebSockets        |
| صعوبة إدارة المجموعات | إمكانية إنشاء مجموعات (Groups) وإدارتها بسهولة           |
| الخصوصية والأمان      | تأمين المحادثات برمز PIN خاص وحماية البيانات             |
| تشتت المحادثات        | تنظيم المحادثات في قائمة واحدة مع إمكانية البحث والفلترة |

## المميزات التقنية

`Real-Time Messaging` `Group Chat` `Secure Conversations (PIN)` `Message Status` `User Presence` `RESTful API`

## توثيق الـ API

### المصادقة (Auth)

#### تسجيل الدخول

```http
POST /api/login
# Body: { email, password }
# Returns: { token, user }
```

#### تسجيل جديد

```http
POST /api/register
# Body: { name, phone_number, email, password }
```

### الملف الشخصي (Profile)

#### عرض بياناتي

```http
GET /api/me
```

#### تعيين رمز PIN

```http
POST /api/profile/pin
# Body: { pin }
```

### المحادثات (Chat)

#### بدء محادثة جديدة

```http
POST /api/chat
# Body: { user_id }
```

#### إنشاء مجموعة

```http
POST /api/groups
# Body: { name, description, members: [id1, id2] }
```

#### عرض المحادثات

```http
GET /api/conversations
```

### الرسائل (Messages)

#### إرسال رسالة

```http
POST /api/conversations/{id}/messages
# Body: { message, type }
```

#### عرض الرسائل

```http
GET /api/conversations/{id}/messages
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/            # المصادقة
│   │   ├── Chat/            # إدارة المحادثات والمجموعات
│   │   ├── Message/         # إدارة الرسائل
│   │   └── User/            # الملف الشخصي
│   ├── Models/              # (User, Conversation, Message, Group...)
│   └── Events/              # أحداث الـ Real-time
└── routes/
    └── api.php              # مسارات المشروع
```

## التثبيت والإعداد

### 1. تثبيت الحزم

```bash
composer install
```

### 2. إعداد البيئة

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### 3. تشغيل الخادم والـ Reverb

```bash
# تشغيل السيرفر
php artisan serve

# في نافذة أخرى: تشغيل Reverb للمحادثة الفورية
php artisan reverb:start
```

---

## تشغيل كل شي تمام ؟

للتأكد من أن كل شيء يعمل بشكل صحيح:

1. تأكد من أن قاعدة البيانات متصلة.
2. تأكد من تشغيل `php artisan serve`.
3. تأكد من تشغيل `php artisan reverb:start` ليعمل الشات الفوري.
4. استخدم Postman لتجربة تسجيل الدخول وإنشاء محادثة.

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

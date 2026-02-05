# Live Chat System API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![MySQL](https://img.shields.io/badge/MySQL-Database-003B57?style=for-the-badge&logo=mysql) ![Sanctum](https://img.shields.io/badge/Auth-Sanctum-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 23**

</div>

---

## نظرة عامة

"Live Chat System" هو نظام محادثة فوري متكامل يتيح للمستخدمين التواصل بشكل لحظي وآمن. يوفر النظام إمكانية المحادثات الخاصة والجماعية، مشاركة الملفات، وتأمين المحادثات برقم سري (PIN)، مما يجعله بيئة تواصل فعالة وآمنة تدعم اللغة العربية بالكامل.

## المشكلات التي يحلها

| المشكلة          | الحل                                         |
| :--------------- | :------------------------------------------- |
| تأخر التواصل     | نظام محادثة فوري (Real-time) باستخدام Pusher |
| الخصوصية والأمان | إمكانية قفل المحادثات الهامة برقم سري (PIN)  |
| التواصل الجماعي  | دعم المجموعات (Groups) مع إدارة الأعضاء      |
| مشاركة الوسائط   | دعم إرسال الصور والمرفقات داخل المحادثات     |

## المميزات التقنية

`Real-time Messaging` `Private/Group Chats` `Locked Conversations` `File Sharing` `Profile Management` `RESTful API`

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
# Body: { name, email, password, phone }
```

### إدارة الملف الشخصي (Profile)

#### تحديث البيانات

```http
POST /api/profile
# Body: { name, about, avatar }
```

#### تعيين رمز الحماية (PIN)

```http
POST /api/profile/pin
# Body: { pin: "1234" }
```

### المحادثات (Conversations)

#### بدء محادثة جديدة

```http
POST /api/chat
# Body: { user_id: 1 }
```

#### إنشاء مجموعة

```http
POST /api/groups
# Body: { name, description, user_ids: [1, 2] }
```

#### قائمة المحادثات

```http
GET /api/conversations
# Returns: List of private and group conversations
```

#### قفل/فتح محادثة

```http
POST /api/conversations/{id}/lock
# Toggle lock status for secure chats
```

### الرسائل (Messages)

#### جلب الرسائل

```http
GET /api/conversations/{id}/messages
# Returns: List of messages with sender details
```

#### إرسال رسالة

```http
POST /api/conversations/{id}/messages
# Body: { content, type: "text"|"image", file? }
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/            # المصادقة
│   │   ├── User/            # الملف الشخصي
│   │   ├── Chat/            # إدارة المحادثات والمجموعات
│   │   └── Message/         # الرسائل والمرفقات
│   └── Models/              # (User, Conversation, Message, Participant...)
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
php artisan storage:link
```

### 3. إعداد Pusher

تأكد من إعداد متغيرات Pusher في ملف `.env` لتفعيل التحديث اللحظي.

### 4. تشغيل الخادم

```bash
php artisan serve
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

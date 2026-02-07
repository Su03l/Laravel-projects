# AuthMaster API - نظام المصادقة المتقدم

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.5-777BB4?style=for-the-badge&logo=php) ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite) ![Sanctum](https://img.shields.io/badge/Auth-Sanctum-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 25**

</div>

---

## نظرة عامة

"AuthMaster" هو نظام مصادقة (Authentication) متكامل وآمن، مصمم ليكون الأساس القوي لأي تطبيق حديث. يوفر النظام ميزات متقدمة مثل المصادقة الثنائية (2FA)، تسجيل الدخول عبر OTP، إدارة الجلسات، وصلاحيات المستخدمين، مع تركيز كبير على الأمان وتجربة المستخدم السلسة.

## المشكلات التي يحلها

| المشكلة | الحل |
| :--- | :--- |
| ضعف الأمان | دعم المصادقة الثنائية (2FA) ورموز OTP لمرة واحدة |
| الحسابات الوهمية | التحقق الإلزامي من البريد الإلكتروني ورقم الهاتف |
| هجمات التخمين | نظام حماية (Rate Limiting) يمنع المحاولات المتكررة |
| إدارة الصلاحيات | لوحة تحكم للأدمن لإدارة المستخدمين وحظر المخالفين |

## المميزات التقنية

`Two-Factor Authentication (2FA)` `OTP Verification` `Role-Based Access Control` `Secure Session Management` `Clean Architecture (DTOs & Actions)` `Rate Limiting`

## توثيق الـ API

### المصادقة (Auth)

#### تسجيل حساب جديد
```http
POST /api/auth/register
# Body: { name, email, phone, password, password_confirmation }
# Returns: User details (Pending Status)
```

#### تفعيل الحساب (OTP)
```http
POST /api/auth/verify
# Body: { email, otp_code }
# Returns: Access Token
```

#### تسجيل الدخول
```http
POST /api/auth/login
# Body: { email, password, remember_me: boolean }
# Returns: Token OR { status: "2fa_required" }
```

#### تأكيد الدخول (2FA)
```http
POST /api/auth/login/verify
# Body: { email, otp_code, remember_me: boolean }
# Returns: Access Token
```

#### إعادة إرسال الرمز
```http
POST /api/auth/resend-otp
# Body: { email }
```

#### استعادة كلمة المرور
```http
POST /api/auth/forgot-password
# Body: { email }
```

#### تعيين كلمة المرور الجديدة
```http
POST /api/auth/reset-password
# Body: { email, otp_code, password, password_confirmation }
```

### إدارة الملف الشخصي (Profile)

#### عرض بياناتي
```http
GET /api/profile
# Returns: User details + Role + Status
```

#### تحديث البيانات
```http
POST /api/profile/update
# Body: { name, phone, avatar? }
```

#### تغيير كلمة المرور
```http
POST /api/profile/change-password
# Body: { current_password, new_password, new_password_confirmation }
```

#### إعدادات المصادقة الثنائية
```http
POST /api/profile/2fa
# Body: { enable: boolean }
```

### لوحة تحكم الأدمن (Admin Dashboard)

#### قائمة المستخدمين
```http
GET /api/admin/users
# Returns: List of all users with details
```

#### إضافة مستخدم جديد
```http
POST /api/admin/users
# Body: { name, email, phone, password, role: "admin|user|employee" }
```

#### حظر مستخدم
```http
POST /api/admin/users/{id}/ban
# Body: { type: "permanent|temporary", days?: int }
```

#### حذف صورة مخالفة
```http
DELETE /api/admin/users/{id}/avatar
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Actions/             # منطق العمليات (Login, Register, Verify...)
│   ├── DTOs/                # نقل البيانات (Data Transfer Objects)
│   ├── Http/Controllers/
│   │   ├── Auth/            # عمليات المصادقة
│   │   ├── User/            # الملف الشخصي
│   │   └── Admin/           # لوحة تحكم الأدمن
│   ├── Services/            # خدمات مساعدة (مثل OTP Service)
│   └── Enums/               # (UserRole, UserStatus)
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
```

### 3. إعداد قاعدة البيانات
```bash
php artisan migrate
php artisan db:seed
```

### 4. تشغيل الخادم والـ Queue
```bash
php artisan serve
php artisan queue:work
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

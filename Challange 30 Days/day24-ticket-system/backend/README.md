# Ticket Support System API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.5-777BB4?style=for-the-badge&logo=php) ![MySQL](https://img.shields.io/badge/MySQL-Database-003B57?style=for-the-badge&logo=mysql) ![Sanctum](https://img.shields.io/badge/Auth-Sanctum-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 24**

</div>

---

## نظرة عامة

"Ticket Support System" هو نظام ذكي لإدارة الدعم الفني وخدمة العملاء. يهدف النظام إلى تنظيم عملية استقبال الشكاوى والمقترحات عبر نظام تذاكر متطور يدعم اتفاقيات مستوى الخدمة (SLA)، وتوزيع الصلاحيات بين المدراء والموظفين والعملاء، مع إمكانية التواصل عبر الردود والملاحظات الداخلية لضمان سرعة وكفاءة الحل.

## المشكلات التي يحلها

| المشكلة | الحل |
| :--- | :--- |
| فوضى الطلبات | تنظيم جميع الشكاوى في تذاكر برقم مرجعي موحد (Ref ID) |
| تأخر الاستجابة | نظام SLA ذكي يحسب وقت الحل المتوقع بناءً على الأولوية |
| تداخل الصلاحيات | نظام أدوار (RBAC) يفصل بين العميل، الموظف، والأدمن |
| التواصل الداخلي | إمكانية إضافة ملاحظات داخلية (Internal Notes) لا يراها العميل |

## المميزات التقنية

`Smart SLA Calculation` `Role-Based Access Control` `Internal/External Comments` `Ticket Assignment` `RESTful API` `Priority Management`

## توثيق الـ API

### المصادقة (Auth)

#### تسجيل الدخول
```http
POST /api/login
# Body: { email, password }
# Returns: { token, user, role }
```

#### تسجيل عميل جديد
```http
POST /api/register
# Body: { name, email, password }
```

### إدارة الملف الشخصي (Profile)

#### جلب بياناتي
```http
GET /api/me
# Returns: User details + Roles + Permissions
```

#### تحديث البيانات
```http
POST /api/profile
# Body: { name, phone, avatar? }
```

#### تغيير كلمة المرور
```http
POST /api/profile/password
# Body: { current_password, new_password, new_password_confirmation }
```

### إدارة المستخدمين (Admin Only)

#### قائمة المستخدمين
```http
GET /api/admin/users
# Query Params: ?search=name&role=Agent
```

#### إنشاء موظف جديد (Agent)
```http
POST /api/admin/agents
# Body: { name, email, password }
```

#### حظر/تفعيل مستخدم
```http
POST /api/admin/users/{id}/toggle-status
```

### التذاكر (Tickets)

#### إنشاء تذكرة (للعملاء)
```http
POST /api/tickets
# Body: { title, description, category_id, priority: "low|medium|high|critical" }
# Returns: Ticket details + SLA Due Date
```

#### عرض التذاكر
```http
GET /api/tickets
# Query Params: ?status=open&priority=high
# ملاحظة: العميل يرى تذاكره فقط، الموظف يرى الكل
```

#### تفاصيل تذكرة
```http
GET /api/tickets/{uuid}
```

### إجراءات الموظفين (Agents)

#### استلام تذكرة (Assign to Me)
```http
POST /api/tickets/{uuid}/assign
```

#### تحديث الحالة
```http
PUT /api/tickets/{uuid}/status
# Body: { status: "resolved", priority? }
```

### الردود والملاحظات (Comments)

#### جلب الردود
```http
GET /api/tickets/{uuid}/comments
```

#### إضافة رد
```http
POST /api/tickets/{uuid}/comments
# Body: { body, is_internal: boolean, attachment? }
# ملاحظة: is_internal متاحة للموظفين فقط
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/            # المصادقة
│   │   ├── Profile/         # الملف الشخصي وإدارة المستخدمين
│   │   ├── Ticket/          # إدارة التذاكر وإجراءات الموظفين
│   │   └── Comment/         # الردود والمرفقات
│   ├── Models/              # (User, Ticket, Category, Comment)
│   └── Enums/               # (TicketStatus, TicketPriority)
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
# لزراعة الأقسام والصلاحيات الأساسية
php artisan db:seed
```

### 4. تشغيل الخادم
```bash
php artisan serve
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

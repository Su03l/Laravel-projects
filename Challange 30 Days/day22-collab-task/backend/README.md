# Collaborative Task Manager API - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![MySQL](https://img.shields.io/badge/MySQL-Database-003B57?style=for-the-badge&logo=mysql) ![Sanctum](https://img.shields.io/badge/Auth-Sanctum-38BDF8?style=for-the-badge&logo=laravel)

**تحدي 30 يوم 30 مشروع - اليوم 22**

</div>

---

## نظرة عامة

"Collaborative Task Manager" هو نظام إدارة مهام تعاوني يتيح للأفراد والفرق تنظيم أعمالهم بكفاءة. يوفر النظام إمكانية إنشاء مجموعات عمل، تعيين المهام للأعضاء، متابعة حالة الإنجاز، ومشاركة الملفات والتعليقات في بيئة تفاعلية تدعم اللغة العربية بالكامل.

## المشكلات التي يحلها

| المشكلة                 | الحل                                              |
| :---------------------- | :------------------------------------------------ |
| تشتت المهام الفردية     | لوحة تحكم مركزية للمهام الشخصية والجماعية         |
| صعوبة التنسيق الفريقي   | نظام مجموعات (Groups) مع صلاحيات (Admin/Member)   |
| ضياع الملفات والملاحظات | إمكانية إرفاق ملفات وتعليقات لكل مهمة بشكل منفصل  |
| متابعة حالة الإنجاز     | تحديثات لحظية لحالة المهمة (قيد التنفيذ / مكتملة) |

## المميزات التقنية

`Team Collaboration` `Task Assignment` `File Attachments` `Comments System` `Role-Based Access` `RESTful API`

## توثيق الـ API

### المصادقة (Auth)

#### تسجيل الدخول

```http
POST /api/login
# Body: { email, password }
# Returns: { token, user }
```

### المجموعات (Groups)

#### إنشاء مجموعة

```http
POST /api/groups
# Body: { name, company_name, description, ... }
```

#### إضافة عضو

```http
POST /api/groups/{id}/members
# Body: { email }
```

#### تفاصيل المجموعة

```http
GET /api/groups/{id}
# Returns: Group details + Members + Tasks
```

### المهام (Tasks)

#### إضافة مهمة

```http
POST /api/tasks
# Body: { title, priority, group_id, assigned_to, ... }
```

#### تفاصيل ومرفقات

```http
GET /api/tasks/{id}
# Returns: Task + Comments + Attachments
```

#### التفاعل (Comments/Files)

```http
POST /api/tasks/{id}/comments
POST /api/tasks/{id}/attachments
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/            # المصادقة
│   │   ├── Group/           # إدارة المجموعات
│   │   └── Task/            # المهام والتعليقات
│   └── Models/              # (User, Group, Task, Comment...)
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

### 3. تشغيل الخادم

```bash
php artisan serve
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

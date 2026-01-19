# Identity Hub - الواجهة الأمامية

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)

**تحدي 30 يوم 30 مشروع - اليوم 10**

</div>

---

![Identity Hub Preview](./public/home.png)

## نظرة عامة

واجهة مستخدم حديثة لنظام مركز الهوية (Identity Hub)، مبنية بـ Next.js 16+ مع App Router. توفر تجربة مستخدم سلسة لتسجيل الدخول، إنشاء الحسابات، وإدارة الملف الشخصي.

## المميزات التقنية

`Next.js 16+` `React 19` `TypeScript` `Tailwind CSS 4` `React Hook Form` `Axios` `Lucide Icons`

## الصفحات

| الصفحة       | المسار                | الوصف                                 |
| ------------ | --------------------- | ------------------------------------- |
| الرئيسية     | `/`                   | صفحة الهبوط مع عرض المميزات           |
| تسجيل الدخول | `/login`              | تسجيل الدخول بالإيميل أو اسم المستخدم |
| إنشاء حساب   | `/register`           | تسجيل حساب جديد                       |
| لوحة التحكم  | `/dashboard`          | عرض معلومات المستخدم                  |
| الإعدادات    | `/dashboard/settings` | تعديل الملف الشخصي وتغيير كلمة المرور |

## المميزات

- تسجيل دخول مزدوج (إيميل أو اسم مستخدم)
- حماية المسارات (Middleware)
- إخفاء/إظهار كلمة المرور
- إشعارات Toast للنجاح والخطأ
- تصميم RTL للعربية
- تصميم أبيض وأسود أنيق

## هيكل المشروع

```
frontend/
├── app/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── PasswordInput.tsx
│   │   └── Card.tsx
│   └── dashboard/
│       └── Sidebar.tsx
├── context/
│   ├── auth-context.tsx
│   └── toast-context.tsx
├── lib/
│   └── axios.ts
├── types/
│   └── index.ts
└── middleware.ts
```

## التثبيت والإعداد

### 1. تثبيت الحزم

```bash
npm install
```

### 2. تشغيل الخادم

```bash
npm run dev
```

> الخادم يعمل على: `http://localhost:3000`

## متطلبات التشغيل

- Node.js 18+
- تشغيل الـ Backend على `http://127.0.0.1:8000`

---

<div align="center">

**صُنع ضمن تحدي 30 يوم 30 مشروع**

</div>

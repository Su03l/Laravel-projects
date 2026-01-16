# دليل الهاتف الذكي - Smart Phonebook

<div align="center">

![Smart Phonebook](./public/home.png)

**واجهة أمامية عصرية لإدارة جهات الاتصال**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## وصف المشروع

تطبيق **دليل الهاتف الذكي** هو واجهة أمامية (Frontend) عصرية مبنية بـ **Next.js 16** و **React 19** مع **Tailwind CSS**. يتصل بـ Laravel API لتوفير تجربة مستخدم سلسة ومتكاملة لإدارة جهات الاتصال.

## المميزات

| الميزة            | الوصف                                 |
| ----------------- | ------------------------------------- |
| تصميم أبيض وأسود  | واجهة أنيقة وعصرية بتصميم Monochrome  |
| دعم اللغة العربية | واجهة كاملة باللغة العربية مع دعم RTL |
| بحث ذكي           | بحث فوري مع Debounce لأداء أفضل       |
| تصميم متجاوب      | يعمل على جميع الأجهزة والشاشات        |
| رفع الصور         | معاينة الصورة قبل الرفع               |
| نسخ الأرقام       | نسخ رقم الهاتف بضغطة زر               |
| إشعارات Toast     | تنبيهات للعمليات الناجحة والفاشلة     |
| تقسيم الصفحات     | تصفح سهل لقوائم جهات الاتصال الطويلة  |

## التقنيات المستخدمة

- **Next.js 16** - إطار عمل React للإنتاج
- **React 19** - مكتبة واجهات المستخدم
- **TypeScript 5** - JavaScript مع الأنواع
- **Tailwind CSS 4** - إطار CSS للتصميم السريع
- **Axios** - مكتبة HTTP للاتصال بـ API
- **Lucide React** - مكتبة أيقونات عصرية

## هيكل المشروع

```
app/
├── components/          # المكونات القابلة لإعادة الاستخدام
│   ├── ContactCard.tsx      # بطاقة جهة الاتصال
│   ├── ContactForm.tsx      # نموذج الإضافة/التعديل
│   ├── ContactList.tsx      # قائمة جهات الاتصال
│   ├── DeleteModal.tsx      # نافذة تأكيد الحذف
│   ├── Pagination.tsx       # أزرار التصفح
│   ├── SearchBar.tsx        # شريط البحث
│   ├── Spinner.tsx          # مؤشر التحميل
│   ├── Toast.tsx            # إشعارات التنبيه
│   ├── ViewContactModal.tsx # عرض تفاصيل جهة الاتصال
│   └── index.ts             # ملف التصدير
├── hooks/               # React Hooks مخصصة
│   ├── useContacts.ts       # إدارة حالة جهات الاتصال
│   └── index.ts
├── lib/                 # الخدمات والأدوات
│   └── api.ts               # Axios API configuration
├── types/               # TypeScript Types
│   └── index.ts
├── globals.css          # الأنماط العامة
├── layout.tsx           # تخطيط التطبيق
└── page.tsx             # الصفحة الرئيسية
```

## التثبيت والتشغيل

### 1. تثبيت الحزم

```bash
npm install
```

### 2. تشغيل خادم التطوير

```bash
npm run dev
```

### 3. فتح التطبيق

افتح المتصفح على العنوان: [http://localhost:3000](http://localhost:3000)

> **ملاحظة:** تأكد من تشغيل Laravel API على `http://127.0.0.1:8000` قبل استخدام التطبيق.

## الاتصال بـ API

التطبيق يتصل بـ Laravel API على العنوان التالي:

```
Base URL: http://127.0.0.1:8000/api
```

### نقاط الاتصال المستخدمة:

| الطلب    | المسار                       | الوصف                  |
| -------- | ---------------------------- | ---------------------- |
| `GET`    | `/contacts?page=1&search=`   | جلب قائمة جهات الاتصال |
| `POST`   | `/contacts`                  | إضافة جهة اتصال جديدة  |
| `POST`   | `/contacts/{id}?_method=PUT` | تعديل جهة اتصال        |
| `DELETE` | `/contacts/{id}`             | حذف جهة اتصال          |

---

<div align="center">

**المشروع جزء من سلسلة: تحدي 30 يوم برمجة**

</div>

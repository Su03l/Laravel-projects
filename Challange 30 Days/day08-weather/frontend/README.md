# نظام الطقس والتحليلات - الواجهة الأمامية

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**تحدي 30 يوم 30 مشروع - اليوم 8**

</div>

---

![واجهة التطبيق](./public/home.png)

---

## نظرة عامة

واجهة أمامية أنيقة ومتقدمة لنظام الطقس والتحليلات، مبنية باستخدام **Next.js 16** مع تصميم **Monochrome Glassmorphism** الفريد. تتميز الواجهة بتجربة مستخدم سلسة مع حركات انتقالية مذهلة باستخدام Framer Motion.

## المميزات

| الميزة              | الوصف                                                 |
| ------------------- | ----------------------------------------------------- |
| تصميم Glassmorphism | تأثيرات زجاجية أنيقة بالأبيض والأسود والرمادي فقط     |
| بحث ذكي             | شريط بحث زجاجي مع حالة تحميل تفاعلية                  |
| المدن الرائجة       | عرض أكثر المدن بحثاً مع إمكانية النقر للبحث           |
| عرض الطقس           | بطاقة طقس شاملة مع درجة الحرارة والأيقونة والإحصائيات |
| تحليلات البحث       | عرض عدد مرات البحث لكل مدينة                          |
| حركات سلسة          | انتقالات وحركات مذهلة مع Framer Motion                |
| تصميم متجاوب        | يعمل بشكل مثالي على جميع الأجهزة                      |

## التقنيات المستخدمة

`Next.js 16` `TypeScript 5` `Tailwind CSS 4` `Axios` `Framer Motion` `Lucide React`

## هيكل المشروع

```
frontend/
├── app/
│   ├── components/
│   │   ├── GlassCard.tsx        # مكون البطاقة الزجاجية
│   │   ├── SearchInput.tsx      # شريط البحث
│   │   ├── WeatherDisplay.tsx   # عرض الطقس
│   │   └── TrendingCities.tsx   # المدن الرائجة
│   ├── services/
│   │   └── api.ts               # خدمة Axios API
│   ├── types/
│   │   └── weather.ts           # أنواع TypeScript
│   ├── globals.css              # التنسيقات العامة
│   ├── layout.tsx               # التخطيط الرئيسي
│   └── page.tsx                 # الصفحة الرئيسية
└── public/
    └── home.png                 # صورة المشروع
```

## التشغيل

### 1. تثبيت الحزم

```bash
npm install
```

### 2. تشغيل خادم التطوير

```bash
npm run dev
```

### 3. فتح المتصفح

```
http://localhost:3000
```

> **ملاحظة:** تأكد من تشغيل الـ Backend أولاً على `http://127.0.0.1:8000`

## نظام التصميم

### الألوان

| اللون                       | الاستخدام        |
| --------------------------- | ---------------- |
| `#000000`                   | الخلفية الرئيسية |
| `#FFFFFF`                   | النصوص الرئيسية  |
| `rgba(255,255,255,0.1-0.3)` | العناصر الزجاجية |

### التأثيرات

- **Backdrop Blur**: تأثير الضبابية الزجاجية
- **Noise Texture**: نسيج noise خفيف على الخلفية
- **Ambient Orbs**: كرات إضاءة محيطية

## الاتصال بالـ API

```typescript
// الحصول على طقس مدينة
GET / api / weather / { city };

// الحصول على المدن الرائجة
GET / api / weather / top;
```

---

<div align="center">

**صُنع ضمن تحدي 30 يوم 30 مشروع**

</div>

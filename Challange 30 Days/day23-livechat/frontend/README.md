# Live Chat Application - الواجهة الأمامية

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)

**تحدي 30 يوم 30 مشروع - اليوم 23**

</div>

---

<div align="center">
  <img src="public/home1.png" alt="Live Chat Screenshot" width="800" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
</div>

<br>

## نظرة عامة

هذه الواجهة الأمامية لنظام المحادثة الفوري، مبنية باستخدام **Next.js** لتقديم أداء عالي وتجربة مستخدم سلسة. تتميز بتصميم عصري وجذاب يدعم اللغة العربية (RTL)، مع تأثيرات حركية ناعمة وتحديث لحظي للبيانات.

## المميزات الرئيسية

- **⚡ تحديث لحظي:** استقبال الرسائل والتنبيهات فوراً دون تحديث الصفحة.
- **🎨 تصميم عصري:** واجهة مستخدم جميلة وتفاعلية مبنية بـ Tailwind CSS.
- **📱 متجاوبة بالكامل:** تعمل بكفاءة على جميع الأجهزة (موبايل، تابلت، ديسكتوب).
- **🔒 حماية الخصوصية:** واجهة خاصة لقفل المحادثات والدخول برمز سري.
- **👤 ملف شخصي متكامل:** إمكانية تعديل البيانات، الصورة الشخصية، والنبذة.

## التقنيات المستخدمة

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Real-time:** Pusher JS & Laravel Echo
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Icons:** Lucide React

## التثبيت والتشغيل

### 1. تثبيت الحزم

```bash
npm install
```

### 2. إعداد المتغيرات

تأكد من وجود ملف `.env.local` يحتوي على رابط الـ API وإعدادات Pusher:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

### 3. تشغيل المشروع

```bash
npm run dev
```

سيتم تشغيل التطبيق على الرابط: `http://localhost:3000`

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

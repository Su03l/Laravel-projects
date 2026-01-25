# Tech News Frontend - واجهة المستخدم

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css) ![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios)

**تحدي 30 يوم 30 مشروع - اليوم 16**

</div>

---

## نظرة عامة

واجهة المستخدم لمنصة "Tech News"، مصممة بأسلوب عصري وأداء عالٍ باستخدام Next.js. توفر تجربة مستخدم سلسة لتصفح الأخبار، قراءة المقالات، والتفاعل مع المحتوى، مع دعم كامل للأجهزة المحمولة (Responsive Design).

## المشكلات التي يحلها

| المشكلة                | الحل                                                             |
| :--------------------- | :--------------------------------------------------------------- |
| بطء التحميل            | استخدام Next.js SSR/SSG لضمان سرعة فائقة في عرض الصفحات          |
| تجربة المستخدم القديمة | تصميم عصري (Clean UI) يركز على المحتوى وسهولة القراءة            |
| صعوبة التفاعل          | واجهات تفاعلية للتعليقات وإدارة المقالات بدون إعادة تحميل الصفحة |
| الوصول للأخبار         | تصنيف ذكي وعرض للمقالات الحديثة يسهل الوصول للمعلومة             |

## المميزات التقنية

`Next.js 14` `App Router` `Server Components` `Client Components Protection` `Lucide Icons` `Responsive Grid`

## صفحات المشروع

### الرئيسية (Home)

- عرض شبكي للمقالات المميزة.
- قائمة جانبية للتصنيفات والأخبار الخارجية.

### قراءة المقال (Single Article)

- `contracts/articles/[id]`
- عرض تفاصيل المقال، الكاتب، والصورة البارزة.
- قسم التعليقات التفاعلي (عرض، إضافة، حذف).

### لوحة المستخدم (User Dashboard)

- `/my-articles`
- عرض مقالات المستخدم المسجل.
- إمكانية حذف المقالات الخاصة.

### المصادقة (Auth Pages)

- `/login`: صفحة تسجيل دخول مخصصة.
- `/register`: صفحة تسجيل حساب جديد مع حقول (الاسم، المعرف، البريد).
- `Login Modal`: نافذة منبثقة لتنبيه الضيوف عند محاولة التفاعل.

## هيكل المشروع

```
frontend/
├── app/
│   ├── articles/
│   │   ├── [id]/page.tsx        # صفحة تفاصيل المقال
│   │   └── create/page.tsx      # صفحة إنشاء مقال
│   ├── login/page.tsx           # صفحة تسجيل الدخول
│   ├── register/page.tsx        # صفحة التسجيل
│   ├── my-articles/page.tsx     # لوحة تحكم المستخدم
│   └── page.tsx                 # الرئيسية
├── components/
│   ├── Navbar.tsx               # شريط التنقل
│   ├── ArticleCard.tsx          # بطاقة المقال
│   ├── CommentSection.tsx       # قسم التعليقات
│   └── LoginModal.tsx           # نافذة تسجيل الدخول
├── context/
│   └── AuthContext.tsx          # إدارة حالة المصادقة
└── lib/
    └── api.ts                   # إعدادات Axios والاتصال بالخلفية
```

## التثبيت والإعداد

### 1. تثبيت الحزم

```bash
npm install
```

### 2. تشغيل بيئة التطوير

```bash
npm run dev
```

### 3. بناء المشروع للإنتاج

```bash
npm run build
npm start
```

---

<div align="center">

**صنع ضمن تحدي 30 يوم 30 مشروع**

</div>

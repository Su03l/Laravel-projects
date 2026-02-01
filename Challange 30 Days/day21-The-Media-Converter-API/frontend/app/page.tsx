import { ToolCard } from "@/components/ui/card";
import {
  QrCode,
  Fingerprint,
  Bitcoin,
  FileText,
  Image as ImageIcon,
  Clock
} from "lucide-react";
import { AnalogClock } from "@/components/features/analog-clock";

// Creating a Client Wrapper for the Clock in the Dashboard if we want it strictly client-side
// but AnalogClock is already "use client".
// We need to fetch data for the clock on the dashboard too if we want it to show Past/Future.
// For now, let's keep the Dashboard clock simple (Current Time) or reuse the component without props.

export default function Home() {
  const tools = [
    {
      title: "مولد رموز QR",
      description: "قم بإنشاء رموز استجابة سريعة لأي نص أو رابط بسهولة وفي ثوانٍ.",
      icon: QrCode,
      href: "/tools/qr",
    },
    {
      title: "مولد المعرفات (UUID)",
      description: "توليد معرفات فريدة من نوع UUID v4 لاستخدامها في تطبيقاتك وقواعد البيانات.",
      icon: Fingerprint,
      href: "/tools/uuid",
    },
    {
      title: "أسعار العملات الرقمية",
      description: "تابع أحدث أسعار العملات الرقمية مثل البيتكوين لحظة بلحظة.",
      icon: Bitcoin,
      href: "/tools/crypto",
    },
    {
      title: "محول النصوص",
      description: "أدوات متقدمة لمعالجة النصوص: تنظيف، تحويل، وتنسيق.",
      icon: FileText,
      href: "/tools/text",
    },
    {
      title: "محول الصور",
      description: "تحويل ومعالجة الصور بطرق مختلفة لتناسب احتياجاتك.",
      icon: ImageIcon,
      href: "/tools/image",
    },
    {
      title: "ساعة الزمن",
      description: "أدوات التعامل مع التوقيت والتحويل بين المناطق الزمنية.",
      icon: Clock,
      href: "/tools/time",
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center py-12">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            أدوات المطورين <span className="text-sky-600">الاحترافية</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            مجموعة متكاملة من الأدوات التي يحتاجها كل مطور.
          </p>
        </div>

        {/* The Clock Section on Home Page as requested */}
        <div className="mb-16 overflow-hidden rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-sm backdrop-blur-sm">
          <div className="text-center md:hidden mb-4 font-bold text-slate-900">الوقت الحالي</div>
          {/* We pass simpler props here or let it self-tick. Backend data might be overkill for home unless fetched. */}
          {/* For a clean look, let's just show the clock without the extra text rings effectively, or static text. */}
          <AnalogClock />
          <div className="mt-4 text-center text-sm text-slate-400">
            الوقت هو أثمن ما يملكه المطور.
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.href}
              {...tool}
            />
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-slate-400">
          تم التطوير باستخدام Next.js 14, Tailwind CSS & Laravel API
        </div>
      </div>
    </div>
  );
}

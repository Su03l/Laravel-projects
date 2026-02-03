import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Manage Your Team <br />
            <span className="text-sky-500">& Tasks Efficiently</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Collaborate, track, and ship projects faster with a tool designed for modern teams. Simple, powerful, and focused on what matters.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="group flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-8 py-3.5 text-lg font-semibold text-white transition-all hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Start Now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center rounded-lg border-2 border-slate-200 bg-transparent px-8 py-3.5 text-lg font-semibold text-slate-900 transition-colors hover:border-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { ArrowRight, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 rounded-2xl bg-sky-50 p-6 shadow-sm">
          <Wallet className="h-16 w-16 text-sky-600" />
        </div>

        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Financial Dashboard <span className="text-sky-600">Pro</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-gray-600">
          Streamline your invoicing and track your financial health with our comprehensive dashboard system. Secure, fast, and reliable.
        </p>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="group flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-600/30 transition-all hover:bg-sky-700 hover:scale-105 active:scale-95"
          >
            Go to Dashboard
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-2xl grid-cols-1 gap-8 border-t border-gray-100 pt-10 sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold text-gray-900">Real-time</h3>
            <p className="text-sm text-gray-500">Live data tracking</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold text-gray-900">Secure</h3>
            <p className="text-sm text-gray-500">Role-based access</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold text-gray-900">Reports</h3>
            <p className="text-sm text-gray-500">PDF & Excel exports</p>
          </div>
        </div>
      </main>
    </div>
  );
}

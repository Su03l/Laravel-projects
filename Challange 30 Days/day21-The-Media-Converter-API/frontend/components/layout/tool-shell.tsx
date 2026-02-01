import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ToolShellProps {
    children: React.ReactNode;
    title: string;
    description?: string;
}

export function ToolShell({ children, title, description }: ToolShellProps) {
    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto max-w-4xl px-4">
                <header className="mb-8">
                    <Link
                        href="/"
                        className="mb-6 inline-flex items-center text-sm font-medium text-sky-600 transition-colors hover:text-sky-700"
                    >
                        <ArrowRight className="ml-1 h-4 w-4" />
                        عودة للرئيسية
                    </Link>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                        {description && (
                            <p className="mt-2 text-slate-500">{description}</p>
                        )}
                    </div>
                </header>
                <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}

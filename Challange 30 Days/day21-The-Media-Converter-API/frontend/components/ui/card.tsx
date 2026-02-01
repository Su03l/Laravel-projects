import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface CardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    className?: string;
}

export function ToolCard({ title, description, icon: Icon, href, className }: CardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group block h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-sky-300 hover:shadow-md hover:-translate-y-1",
                className
            )}
        >
            <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-100 group-hover:text-sky-700">
                    <Icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{description}</p>
                </div>
            </div>
        </Link>
    );
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-4 dark:bg-slate-950">
            <div className="w-full max-w-2xl space-y-8">
                {children}
            </div>
        </div>
    );
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-slate-50">
            {/* Decorative background blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

            <div className="w-full max-w-md space-y-8 relative z-10">
                {children}
            </div>
        </div>
    )
}

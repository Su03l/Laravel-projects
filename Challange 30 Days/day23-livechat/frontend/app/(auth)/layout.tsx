export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 via-white to-white opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-6">
                {children}
            </div>
        </div>
    );
}

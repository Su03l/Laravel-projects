export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-white relative overflow-hidden">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-white to-white opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sky-100/50 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3"></div>
            </div>

            {/* No width restriction on children - let pages control their own layout */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}

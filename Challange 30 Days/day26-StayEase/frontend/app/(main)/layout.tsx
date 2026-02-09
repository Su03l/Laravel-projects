import { MainHeader } from '@/components/layouts/main-header';
import { MainFooter } from '@/components/layouts/main-footer';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <MainHeader />
            <main className="flex-1">{children}</main>
            <MainFooter />
        </div>
    );
}

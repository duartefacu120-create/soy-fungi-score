import Sidebar from "@/components/layout/Sidebar";
import SuccessAlert from "@/components/SuccessAlert";
import { Suspense } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="pl-64">
                <div className="container mx-auto p-8">
                    <Suspense fallback={null}>
                        <SuccessAlert />
                    </Suspense>
                    {children}
                </div>
            </main>
        </div>
    );
}

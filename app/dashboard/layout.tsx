import Sidebar from "@/components/layout/Sidebar";
import SuccessAlert from "@/components/SuccessAlert";
import { Suspense } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 lg:pl-64 pt-16 lg:pt-0">
                <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                    <Suspense fallback={null}>
                        <SuccessAlert />
                    </Suspense>
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

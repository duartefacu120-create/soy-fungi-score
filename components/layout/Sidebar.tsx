"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    Calendar,
    Home as HomeIcon,
    LogOut,
    BookOpen,
    Users,
    Building2,
    Menu,
    X,
    Leaf
} from "lucide-react";
import { logout } from "@/app/actions";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/campaigns", label: "Campañas", icon: Calendar },
    { href: "/establishments", label: "Establecimientos", icon: HomeIcon },
    { href: "/enterprise", label: "Panel Empresarial", icon: Building2 },
    { href: "/team", label: "Mi Grupo/Empresa", icon: Users },
    { href: "/evidence", label: "Evidencia Científica", icon: BookOpen },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar when clicking a link on mobile
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        if (confirm("¿Cerrar sesión?")) {
            await logout();
        }
    };

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 px-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-bold text-green-700">SoyFungiScore</span>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 z-40 h-screen w-64 border-r bg-white transition-transform duration-300 ease-in-out lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center gap-3 border-b px-6">
                    <Leaf className="h-6 w-6 text-green-600" />
                    <span className="text-xl font-bold text-green-700">SoyFungiScore</span>
                </div>

                <div className="flex flex-col justify-between h-[calc(100vh-65px)] p-4">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                                        isActive
                                            ? "bg-green-600 text-white shadow-md shadow-green-200 font-medium"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-green-700"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, Calendar, Home as HomeIcon, LogOut, BookOpen, Users, Building2 } from "lucide-react";
import { logout } from "@/app/actions";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/campaigns", label: "Campañas", icon: Calendar },
    { href: "/establishments", label: "Establecimientos", icon: HomeIcon },
    { href: "/enterprise", label: "Panel Empresarial", icon: Building2 },
    { href: "/team", label: "Mi Empresa", icon: Users },
    { href: "/evidence", label: "Evidencia Científica", icon: BookOpen },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        if (confirm("¿Cerrar sesión?")) {
            await logout();
        }
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
            <div className="flex h-16 items-center gap-3 border-b px-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600">
                    <path d="M5 10c0 5 4 9 9 9h3a2 2 0 0 0 2-2v-1c0-5-4-9-9-9H7a2 2 0 0 0-2 2v1Z" />
                    <path d="M9 13.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
                    <path d="M14 13.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
                </svg>
                <span className="text-xl font-bold text-green-700">SoyFungiScore</span>
            </div>

            <div className="flex flex-col justify-between h-[calc(100vh-65px)] p-4">
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-green-700",
                                    isActive ? "bg-green-50 text-green-700 font-medium" : "text-gray-500 hover:bg-gray-100"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}

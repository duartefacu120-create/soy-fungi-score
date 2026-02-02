"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Sprout, ClipboardList, Settings, LogOut } from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/campaigns", label: "Campañas", icon: Settings },
    { href: "/establishments", label: "Establecimientos", icon: Sprout },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
            <div className="flex h-16 items-center border-b px-6">
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

                <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}

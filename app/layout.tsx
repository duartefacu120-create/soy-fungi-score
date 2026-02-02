import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SoyFungiScore",
    description: "Sistema de apoyo para decisiones agronómicas",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={clsx(inter.className, "min-h-screen bg-gray-50 text-gray-900")}>
                {children}
            </body>
        </html>
    );
}

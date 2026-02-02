import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#166534", // green-800
                secondary: "#ca8a04", // yellow-600
                destructive: "#dc2626", // red-600
            },
        },
    },
    plugins: [],
};
export default config;

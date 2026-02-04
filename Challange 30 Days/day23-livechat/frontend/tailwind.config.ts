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
                background: "#ffffff",
                foreground: "#020617", // slate-950
                primary: {
                    DEFAULT: "#0ea5e9", // sky-500
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#f1f5f9", // slate-100
                    foreground: "#64748b", // slate-500
                },
            },
            borderRadius: {
                '3xl': '32px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;

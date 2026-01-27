"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import api from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface User {
    id: number;
    name: string;
    email: string;
    type: "seeker" | "company";
    avatar?: string;
    bio?: string;
    website?: string;
    cv_path?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    mutate: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const { data } = await api.get("/profile");
                setUser(data);
            } catch (err) {
                console.error("Auth check failed", err);
                localStorage.removeItem("token");
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (credentials: any) => {
        setError(null);
        try {
            const { data } = await api.post("/login", credentials);
            localStorage.setItem("token", data.token);
            toast.success("تم تسجيل الدخول بنجاح! نورتنا 👋");

            await fetchUser();

            if (data.user.type === "company") {
                router.push("/company/dashboard");
            } else {
                router.push("/");
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "فشل تسجيل الدخول";
            setError(msg);
            toast.error(msg);
            throw err;
        }
    };

    const register = async (credentials: any) => {
        setError(null);
        try {
            await api.post("/register", credentials);

            // SPECIAL FLOW: Register -> Login Page with Countdown
            toast.dismiss();
            toast.success("تم إنشاء الحساب بنجاح! 🎉");

            // Countdown toast
            const toastId = toast.loading("جاري تحويلك لصفحة الدخول خلال 3...");
            setTimeout(() => toast.loading("جاري تحويلك لصفحة الدخول خلال 2...", { id: toastId }), 1000);
            setTimeout(() => toast.loading("جاري تحويلك لصفحة الدخول خلال 1...", { id: toastId }), 2000);

            setTimeout(() => {
                toast.dismiss(toastId);
                router.push("/login");
            }, 3000);

            // We do NOT log them in automatically here, as per user request to redirect to login
        } catch (err: any) {
            const msg = err.response?.data?.message || "فشل إنشاء الحساب";
            setError(msg);
            toast.error(msg);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            toast.success("نشوفك على خير! 👋");
            router.push("/login");
        }
    };

    const mutate = async () => {
        await fetchUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, mutate, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

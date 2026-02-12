"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// User interface
interface User {
    id: number;
    name: string;
    email: string;
    wallet_balance: number;
    two_factor_enabled: boolean;
    joined_at: string;
}


interface AuthResult {
    success?: boolean;
    requireOtp?: boolean;
    requireVerify?: boolean;
    email?: string;
}

interface AuthContextType {
    user: User | null;
    login: (data: { email: string; password: string }) => Promise<AuthResult>;
    register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<AuthResult>;
    verifyAccount: (email: string, otp: string) => Promise<void>;
    verifyLogin: (email: string, otp: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (data: { email: string; otp: string; password: string; password_confirmation: string }) => Promise<void>;
    updateProfile: (data: { name: string; password?: string; password_confirmation?: string }) => Promise<void>;
    toggleTwoFactor: (enable: boolean) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        try {
            const { data } = await api.get("/api/user");
            setUser(data.data || data);
        } catch {
            setUser(null);
            localStorage.removeItem("token");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = async (credentials: { email: string; password: string }): Promise<AuthResult> => {
        const { data } = await api.post("/api/login", credentials);

        // 2FA required
        if (data.data?.require_otp) {
            toast.info("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
            router.push(`/verify-2fa?email=${encodeURIComponent(credentials.email)}`);
            return { requireOtp: true, email: credentials.email };
        }

        // Store token & user
        if (data.data?.token) {
            localStorage.setItem("token", data.data.token);
        }
        if (data.data?.user) {
            setUser(data.data.user);
        }
        toast.success(data.message || "تم تسجيل الدخول بنجاح");
        router.push("/chat");
        return { success: true };
    };

    const register = async (formData: { name: string; email: string; password: string; password_confirmation: string }): Promise<AuthResult> => {
        const { data } = await api.post("/api/register", formData);
        toast.success(data.message || "تم إنشاء الحساب. تحقق من بريدك للحصول على رمز التفعيل");
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
        return { requireVerify: true, email: formData.email };
    };

    const verifyAccount = async (email: string, otp: string) => {
        const { data } = await api.post("/api/verify-account", { email, otp });
        if (data.data?.token) {
            localStorage.setItem("token", data.data.token);
        }
        if (data.data?.user) {
            setUser(data.data.user);
        }
        toast.success(data.message || "تم تفعيل الحساب بنجاح!");
        router.push("/chat");
    };

    const verifyLogin = async (email: string, otp: string) => {
        const { data } = await api.post("/api/login/verify", { email, otp });
        if (data.data?.token) {
            localStorage.setItem("token", data.data.token);
        }
        if (data.data?.user) {
            setUser(data.data.user);
        }
        toast.success(data.message || "تم تسجيل الدخول بنجاح!");
        router.push("/chat");
    };

    const forgotPassword = async (email: string) => {
        const { data } = await api.post("/api/forgot-password", { email });
        toast.success(data.message || "تم إرسال رمز إعادة التعيين");
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    };

    const resetPassword = async (formData: { email: string; otp: string; password: string; password_confirmation: string }) => {
        const { data } = await api.post("/api/reset-password", formData);
        toast.success(data.message || "تم تغيير كلمة المرور بنجاح");
        router.push("/login");
    };

    const updateProfile = async (formData: { name: string; password?: string; password_confirmation?: string }) => {
        const { data } = await api.put("/api/user/profile", formData);
        if (data.data) {
            setUser(data.data);
        }
        toast.success(data.message || "تم تحديث الملف الشخصي");
    };

    const toggleTwoFactor = async (enable: boolean) => {
        const { data } = await api.post("/api/user/2fa", { enable });
        if (data.data) {
            setUser(data.data);
        }
        toast.success(data.message || (enable ? "تم تفعيل المصادقة الثنائية" : "تم تعطيل المصادقة الثنائية"));
    };

    const logout = async () => {
        try {
            await api.post("/api/logout");
        } catch {
            // Ignore
        }
        localStorage.removeItem("token");
        setUser(null);
        toast.success("تم تسجيل الخروج");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{
            user, login, register, verifyAccount, verifyLogin,
            forgotPassword, resetPassword, updateProfile, toggleTwoFactor,
            logout, isLoading, refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

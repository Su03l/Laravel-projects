"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: number;
    name: string;
    email: string;
    type: "seeker" | "company";
    avatar?: string;
    bio?: string;
    website?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
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
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        setError(null);
        try {
            const { data } = await api.post("/login", credentials);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user)); // Optional, for quick access
            setUser(data.user);

            // Redirect based on role
            if (data.user.type === "company") {
                router.push("/company/dashboard");
            } else {
                router.push("/");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
            throw err;
        }
    };

    const register = async (credentials: any) => {
        setError(null);
        try {
            const { data } = await api.post("/register", credentials);
            localStorage.setItem("token", data.token);
            setUser(data.user);

            // Redirect based on role
            if (data.user.type === "company") {
                router.push("/company/dashboard");
            } else {
                router.push("/");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
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
            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>
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

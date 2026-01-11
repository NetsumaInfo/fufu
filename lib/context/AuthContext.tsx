"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface User {
    id: string;
    username: string;
    email: string;
    country: string | null;
    age: number | null;
    avatar: string | null; // File path in storage
    avatarUrl?: string | null; // Signed URL for display
    gender: string | null;
    youtubeLink: string | null;
    discordId: string | null;
    twitter: string | null;
    bluesky: string | null;
    team: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    country: string;
    age: number;
    gender: string;
    team: string;
    avatar?: string; // Base64 data URL
    youtubeLink?: string;
    discordId?: string;
    twitter?: string;
    bluesky?: string;
}

interface ProfileUpdateData {
    username?: string;
    email?: string;
    country?: string;
    age?: number;
    avatar?: string; // Base64 data URL for upload
    gender?: string;
    youtubeLink?: string;
    discordId?: string;
    twitter?: string;
    bluesky?: string;
    team?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    updateProfile: (data: ProfileUpdateData) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch current user profile from API
    const fetchProfile = useCallback(async () => {
        try {
            const response = await fetch("/api/auth/profile", {
                method: "GET",
                credentials: "include", // Important for cookies
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    setUser(data.user);
                    return true;
                }
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
        setUser(null);
        return false;
    }, []);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            await fetchProfile();
            setIsLoading(false);
        };
        checkAuth();
    }, [fetchProfile]);

    const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setUser(result.user);
                return { success: true };
            }

            return { success: false, error: result.error || "Erreur lors de l'inscription" };
        } catch (error) {
            console.error("Register error:", error);
            return { success: false, error: "Erreur de connexion au serveur" };
        }
    };

    const login = async (username: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password, rememberMe }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setUser(result.user);
                return { success: true };
            }

            return { success: false, error: result.error || "Identifiants incorrects" };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: "Erreur de connexion au serveur" };
        }
    };

    const updateProfile = async (data: ProfileUpdateData): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch("/api/auth/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setUser(result.user);
                return { success: true };
            }

            return { success: false, error: result.error || "Erreur lors de la mise à jour" };
        } catch (error) {
            console.error("Update profile error:", error);
            return { success: false, error: "Erreur de connexion au serveur" };
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/profile", {
                method: "DELETE",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        }
        setUser(null);
        router.push("/");
    };

    const refreshProfile = async () => {
        await fetchProfile();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                updateProfile,
                logout,
                refreshProfile,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

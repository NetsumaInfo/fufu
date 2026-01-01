"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
    username: string;
    email: string;
    country: string;
    dateOfBirth: string;
    avatar?: string; // Base64 data URL for profile picture
    // Profile extended fields
    gender?: string;
    youtubeLink?: string;
    discordId?: string;
    twitter?: string;
    bluesky?: string;
    team?: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    country: string;
    dateOfBirth: string;
    gender: string;
    team: string;
    // Optional social links
    youtubeLink?: string;
    discordId?: string;
    twitter?: string;
    bluesky?: string;
}

interface ProfileUpdateData {
    username?: string;
    email?: string;
    country?: string;
    dateOfBirth?: string;
    avatar?: string;
    gender?: string;
    youtubeLink?: string;
    discordId?: string;
    twitter?: string;
    bluesky?: string;
    team?: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    requestPasswordReset: (email: string) => Promise<boolean>;
    updateProfile: (data: ProfileUpdateData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const USER_KEY = "fulguria_user";
const USERS_DB_KEY = "fulguria_users_db";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem(USER_KEY);
            }
        }
    }, []);

    // Get all registered users from localStorage
    const getRegisteredUsers = (): Record<string, { user: User; password: string }> => {
        try {
            const data = localStorage.getItem(USERS_DB_KEY);
            return data ? JSON.parse(data) : {};
        } catch {
            return {};
        }
    };

    // Save registered users to localStorage
    const saveRegisteredUsers = (users: Record<string, { user: User; password: string }>) => {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    };

    const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        const { username, email, password, country, dateOfBirth, gender, team } = data;

        // Validation
        if (username.length < 3) {
            return { success: false, error: "Le nom d'utilisateur doit contenir au moins 3 caractères." };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: "Veuillez entrer une adresse e-mail valide." };
        }

        if (password.length < 6) {
            return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères." };
        }

        if (!country) {
            return { success: false, error: "Veuillez sélectionner un pays." };
        }

        if (!dateOfBirth) {
            return { success: false, error: "Veuillez entrer votre date de naissance." };
        }

        if (!gender) {
            return { success: false, error: "Veuillez sélectionner un genre." };
        }

        if (!team) {
            return { success: false, error: "Veuillez sélectionner une équipe." };
        }

        // Check if username or email already exists
        const users = getRegisteredUsers();
        const usernameExists = Object.values(users).some(u => u.user.username.toLowerCase() === username.toLowerCase());
        const emailExists = Object.values(users).some(u => u.user.email.toLowerCase() === email.toLowerCase());

        if (usernameExists) {
            return { success: false, error: "Ce nom d'utilisateur est déjà pris." };
        }

        if (emailExists) {
            return { success: false, error: "Cette adresse e-mail est déjà utilisée." };
        }

        // Create new user
        const newUser: User = {
            username,
            email,
            country,
            dateOfBirth,
            gender,
            team,
            youtubeLink: data.youtubeLink || "",
            discordId: data.discordId || "",
            twitter: data.twitter || "",
            bluesky: data.bluesky || ""
        };

        // Save to "database"
        users[username.toLowerCase()] = { user: newUser, password };
        saveRegisteredUsers(users);

        // Auto login after registration
        setUser(newUser);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));

        return { success: true };
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        const users = getRegisteredUsers();
        const userKey = username.toLowerCase();
        const existingUser = users[userKey];

        if (existingUser && existingUser.password === password) {
            setUser(existingUser.user);
            localStorage.setItem(USER_KEY, JSON.stringify(existingUser.user));
            return true;
        }

        // Fallback: Allow simple login for demo (any username with 4+ char password)
        if (username && password.length >= 4) {
            const demoUser: User = {
                username,
                email: "",
                country: "",
                dateOfBirth: "",
                gender: "Non spécifié",
                team: "Aucune Team"
            };
            setUser(demoUser);
            localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
            return true;
        }

        return false;
    };

    const updateProfile = async (data: ProfileUpdateData): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            return { success: false, error: "Vous devez être connecté." };
        }

        const users = getRegisteredUsers();
        const oldUserKey = user.username.toLowerCase();

        // If username is being changed, check for conflicts
        if (data.username && data.username.toLowerCase() !== oldUserKey) {
            const usernameExists = Object.values(users).some(
                u => u.user.username.toLowerCase() === data.username!.toLowerCase()
            );
            if (usernameExists) {
                return { success: false, error: "Ce nom d'utilisateur est déjà pris." };
            }
        }

        // If email is being changed, check for conflicts
        if (data.email && data.email.toLowerCase() !== user.email.toLowerCase()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                return { success: false, error: "Veuillez entrer une adresse e-mail valide." };
            }
            const emailExists = Object.values(users).some(
                u => u.user.email.toLowerCase() === data.email!.toLowerCase() && u.user.username.toLowerCase() !== oldUserKey
            );
            if (emailExists) {
                return { success: false, error: "Cette adresse e-mail est déjà utilisée." };
            }
        }

        // Update user data
        const updatedUser: User = {
            ...user,
            ...data
        };

        // Update in "database" if user exists there
        if (users[oldUserKey]) {
            const password = users[oldUserKey].password;

            // If username changed, delete old key and create new one
            if (data.username && data.username.toLowerCase() !== oldUserKey) {
                delete users[oldUserKey];
                users[data.username.toLowerCase()] = { user: updatedUser, password };
            } else {
                users[oldUserKey] = { user: updatedUser, password };
            }

            saveRegisteredUsers(users);
        }

        // Update current user state
        setUser(updatedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

        return { success: true };
    };

    const requestPasswordReset = async (email: string): Promise<boolean> => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(USER_KEY);
        router.push("/");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                requestPasswordReset,
                updateProfile,
                logout,
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

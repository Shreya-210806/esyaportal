import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  consumerNumber: string;
  consumerName: string;
  address: string;
  role: "user" | "admin" | "new";
  consumers: Consumer[];
  joinedDate: string;
  connectionStatus: "pending" | "active";
  isFirstLogin?: boolean;
}

export interface Consumer {
  id: string;
  consumerNumber: string;
  consumerName: string;
  meterNumber: string;
  address: string;
  connectionType: string;
  sanctionedLoad: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (consumerInput: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("esyasoft_mongo_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // ================= LOGIN =================
  const login = async (
    consumerInput: string,
    password: string
  ): Promise<boolean> => {
    try {
      const body: any = { password };

      if (consumerInput.includes("@")) {
        body.email = consumerInput;
      } else {
        body.consumerNumber = consumerInput;
      }

      const res = await fetch(`${apiUrl}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return false;
      }

      const u = data.user;

      const role: User["role"] =
        u.role === "admin" ? "admin" : u.isFirstLogin ? "new" : "user";

      const mongoUser: User = {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "",
        consumerNumber: u.consumerNumber,
        consumerName: u.name,
        address: u.address,
        role,
        consumers: [
          {
            id: u.id,
            consumerNumber: u.consumerNumber,
            consumerName: u.name,
            meterNumber: u.meterNumber,
            address: u.address,
            connectionType: "Residential",
            sanctionedLoad: "5 KW",
          },
        ],
        joinedDate: new Date().toISOString().split("T")[0],
        connectionStatus: u.isFirstLogin ? "pending" : "active",
        isFirstLogin: u.isFirstLogin,
      };

      localStorage.setItem("esyasoft_mongo_user", JSON.stringify(mongoUser));
      setUser(mongoUser);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // ================= ADMIN LOGIN =================
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    const success = await login(email, password);

    if (!success) return false;

    const current = localStorage.getItem("esyasoft_mongo_user");
    const parsed = current ? (JSON.parse(current) as User) : null;

    if (!parsed || parsed.role !== "admin") {
      // Not an admin – clear any user session
      localStorage.removeItem("esyasoft_mongo_user");
      setUser(null);
      return false;
    }

    return true;
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("esyasoft_mongo_user");
    setUser(null);
  };

  // ================= SET USER =================
  const updateUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem("esyasoft_mongo_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("esyasoft_mongo_user");
    }
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        adminLogin,
        logout,
        setUser: updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
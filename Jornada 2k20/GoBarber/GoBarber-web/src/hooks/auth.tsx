/* eslint-disable @typescript-eslint/ban-types */
import React, { createContext, useCallback, useState, useContext } from "react";
import api from "../services/api";

interface AuthState {
    token: string;
    user: object;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextData {
    // eslint-disable-next-line @typescript-eslint/ban-types
    user: object;
    singIn(credentials: SignInCredentials): Promise<void>;
    singOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem("@GoBarber:token");
        const user = localStorage.getItem("@GoBarber:user");

        if (token && user) {
            return { token, user: JSON.parse(user) };
        }

        return {} as AuthState;
    });

    const singIn = useCallback(async ({ email, password }) => {
        // console.log("singIn");
        const response = await api.post("/sessions", {
            email,
            password,
        });
        // console.log(response.data);
        const { token, user } = response.data;

        localStorage.setItem("@GoBarber:token", token);
        localStorage.setItem("@GoBarber:user", JSON.stringify(user));

        setData({ token, user });
    }, []);

    const singOut = useCallback(() => {
        localStorage.removeItem("@GoBarber:token");
        localStorage.removeItem("@GoBarber:user");

        setData({} as AuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, singIn, singOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

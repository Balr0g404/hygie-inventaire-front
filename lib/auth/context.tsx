"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, usersApi, ApiError } from '@/lib/api/client'
import type { User, LoginRequest, RegisterRequest } from '@/lib/api/types'

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (credentials: LoginRequest) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const refreshUser = useCallback(async () => {
        try {
            const tokens = authApi.getTokens()
            if (!tokens?.access) {
                setUser(null)
                return
            }
            const userData = await usersApi.getMe()
            setUser(userData)
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                authApi.setTokens(null)
            }
            setUser(null)
        }
    }, [])

    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true)
            await refreshUser()
            setIsLoading(false)
        }
        initAuth()
    }, [refreshUser])

    const login = async (credentials: LoginRequest) => {
        await authApi.login(credentials)
        await refreshUser()
        router.push('/dashboard')
    }

    const register = async (data: RegisterRequest) => {
        await authApi.register(data)
        // After registration, log in automatically
        await login({ email: data.email, password: data.password })
    }

    const logout = async () => {
        try {
            await authApi.logout()
        } finally {
            setUser(null)
            router.push('/login')
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"
import { useAuth } from "@/lib/auth/context"

export default function DashboardLayout({children}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login")
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <IconLoader2 className="size-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Chargement...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}

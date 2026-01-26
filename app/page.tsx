"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"
import { useAuth } from "@/lib/auth/context"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, router])

  return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <IconLoader2 className="size-8 animate-spin text-primary" />
      </div>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"
import { useAuth } from "@/lib/auth/context"
import { ApiError } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { BrandLogoCompact } from "@/components/brand-logo"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const { login, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    React.useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard")
        }
    }, [isAuthenticated, isLoading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            await login({ email, password })
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("Une erreur inattendue est survenue")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <IconLoader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (isAuthenticated) {
        return null
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
            <div className="absolute right-4 top-4">
                <ThemeToggle />
            </div>
            <BrandLogoCompact className="mb-8" />

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Connexion</CardTitle>
                    <CardDescription>
                        Entrez vos identifiants pour acceder a votre compte
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Adresse email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="prenom.nom@croix-rouge.fr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                                >
                                    Mot de passe oublie ?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Votre mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                disabled={isSubmitting}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full m-2" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <IconLoader2 className="mr-2 size-4 animate-spin" />
                                    Connexion en cours...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Pas encore de compte ?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-primary hover:underline"
                            >
                                Creer un compte
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>

            <p className="mt-8 text-center text-xs text-muted-foreground">
                En vous connectant, vous acceptez nos{" "}
                <Link href="/terms" className="underline hover:text-foreground">
                    Conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link href="/privacy" className="underline hover:text-foreground">
                    Politique de confidentialite
                </Link>
            </p>
        </div>
    )
}

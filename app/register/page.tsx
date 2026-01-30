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
export default function RegisterPage() {
    const [fullName, setFullName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [error, setError] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const { register, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    React.useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard")
        }
    }, [isAuthenticated, isLoading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas")
            return
        }

        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caracteres")
            return
        }

        setIsSubmitting(true)

        try {
            await register({ email, password, full_name: fullName })
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
                    <CardTitle className="text-2xl">Creer un compte</CardTitle>
                    <CardDescription>
                        Remplissez le formulaire pour creer votre compte
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
                            <Label htmlFor="fullName">Nom complet</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Jean Dupont"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                autoComplete="name"
                                disabled={isSubmitting}
                            />
                        </div>
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
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Au moins 8 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Repetez votre mot de passe"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                disabled={isSubmitting}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full m-2" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <IconLoader2 className="mr-2 size-4 animate-spin" />
                                    Creation en cours...
                                </>
                            ) : (
                                "Creer mon compte"
                            )}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Vous avez deja un compte ?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-primary hover:underline"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>

            <p className="mt-8 text-center text-xs text-muted-foreground">
                En creant un compte, vous acceptez nos{" "}
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

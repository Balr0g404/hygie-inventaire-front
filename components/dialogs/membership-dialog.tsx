"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { mutate } from "swr"
import { toast } from "sonner"

import { membershipsApi } from "@/lib/api/client"
import type { Membership, MembershipGrade, MembershipRole, Structure, User } from "@/lib/api/types"
import { MembershipGradeLabels, MembershipRoleLabels } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface MembershipDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    membership?: Membership | null
    users: User[]
    structures: Structure[]
}

const ROLES: MembershipRole[] = ["VIEWER", "REFERENT", "ADMIN"]
const GRADES: MembershipGrade[] = ["STAGIAIRE", "PSE1", "PSE2", "CI", "CDPE", "CDMGE"]

export function MembershipDialog({
    open,
    onOpenChange,
    membership,
    users,
    structures,
}: MembershipDialogProps) {
    const isEditing = !!membership
    const [formData, setFormData] = useState({
        user: "",
        structure: "",
        role: "VIEWER" as MembershipRole,
        grade: "PSE1" as MembershipGrade,
        is_fc_up_to_date: true,
        is_active: true,
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (membership) {
            setFormData({
                user: membership.user.toString(),
                structure: membership.structure.toString(),
                role: membership.role,
                grade: membership.grade,
                is_fc_up_to_date: membership.is_fc_up_to_date,
                is_active: membership.is_active,
            })
        } else {
            setFormData({
                user: users[0]?.id.toString() || "",
                structure: structures[0]?.id.toString() || "",
                role: "VIEWER",
                grade: "PSE1",
                is_fc_up_to_date: true,
                is_active: true,
            })
        }
    }, [membership, users, structures, open])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                user: parseInt(formData.user),
                structure: parseInt(formData.structure),
                role: formData.role,
                grade: formData.grade,
                is_fc_up_to_date: formData.is_fc_up_to_date,
                is_active: formData.is_active,
            }

            if (isEditing && membership) {
                await membershipsApi.update(membership.id, payload)
                toast.success("Affectation mise a jour avec succes")
            } else {
                await membershipsApi.create(payload as Omit<Membership, "id" | "created_at">)
                toast.success("Affectation creee avec succes")
            }
            await mutate("memberships")
            onOpenChange(false)
        } catch (error) {
            toast.error(isEditing ? "Erreur lors de la mise a jour" : "Erreur lors de la creation")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Modifier l'affectation" : "Nouvelle affectation"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Modifiez le role de l'utilisateur dans la structure."
                                : "Assignez un utilisateur a une structure."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="membership-user">Utilisateur *</Label>
                            <Select
                                value={formData.user}
                                onValueChange={(value) => setFormData({ ...formData, user: value })}
                            >
                                <SelectTrigger id="membership-user">
                                    <SelectValue placeholder="Choisir un utilisateur" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.full_name || user.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="membership-structure">Structure *</Label>
                            <Select
                                value={formData.structure}
                                onValueChange={(value) => setFormData({ ...formData, structure: value })}
                            >
                                <SelectTrigger id="membership-structure">
                                    <SelectValue placeholder="Choisir une structure" />
                                </SelectTrigger>
                                <SelectContent>
                                    {structures.map((structure) => (
                                        <SelectItem key={structure.id} value={structure.id.toString()}>
                                            {structure.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="membership-role">Role *</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, role: value as MembershipRole })
                                    }
                                >
                                    <SelectTrigger id="membership-role">
                                        <SelectValue placeholder="Choisir un role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {MembershipRoleLabels[role]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="membership-grade">Grade *</Label>
                                <Select
                                    value={formData.grade}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, grade: value as MembershipGrade })
                                    }
                                >
                                    <SelectTrigger id="membership-grade">
                                        <SelectValue placeholder="Choisir un grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GRADES.map((grade) => (
                                            <SelectItem key={grade} value={grade}>
                                                {MembershipGradeLabels[grade]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="membership-fc"
                                    checked={formData.is_fc_up_to_date}
                                    onCheckedChange={(checked) =>
                                        setFormData({
                                            ...formData,
                                            is_fc_up_to_date: checked as boolean,
                                        })
                                    }
                                />
                                <label htmlFor="membership-fc" className="text-sm cursor-pointer">
                                    Formation continue a jour
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="membership-active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, is_active: checked as boolean })
                                    }
                                />
                                <label htmlFor="membership-active" className="text-sm cursor-pointer">
                                    Affectation active
                                </label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !formData.user || !formData.structure}
                        >
                            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
                            {isEditing ? "Enregistrer" : "Creer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

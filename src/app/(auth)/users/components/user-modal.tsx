"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

import { User } from "@/schemas/user"
import UserForm from "./user-form"

interface UserModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	user?: User
}

export default function UserModal({
	open,
	onOpenChange,
	user,
}: UserModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{user ? "Editar usuário" : "Adicionar usuário"}
					</DialogTitle>
					<DialogDescription>
						{user
							? "Edite as informações do usuário e clique em salvar"
							: "Preencha as informações do novo usuário e clique em salvar"}
					</DialogDescription>
				</DialogHeader>
				<UserForm user={user} onSuccess={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	)
}

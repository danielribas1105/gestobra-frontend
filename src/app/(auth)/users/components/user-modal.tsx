"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

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
				<UserForm user={user} onSuccess={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	)
}

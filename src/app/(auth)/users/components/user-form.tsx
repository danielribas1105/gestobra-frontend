"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserMutations } from "@/hooks/users/use-user-mutations"
import { User } from "@/schemas/user"
import { useState } from "react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface UserFormProps {
	user?: User
	onSuccess?: () => void
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
	const isEdit = !!user

	const { createUser, updateUser, deleteUser } = useUserMutations()

	const [form, setForm] = useState({
		name: user?.name || "",
		email: user?.email || "",
	})

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()

		try {
			if (isEdit) {
				await updateUser.mutateAsync({
					id: user!.id,
					data: form,
				})
			} else {
				await createUser.mutateAsync(form)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!user) return

		try {
			await deleteUser.mutateAsync(user.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createUser.isPending || updateUser.isPending || deleteUser.isPending

	console.warn("🚧 UserForm user:", user)

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Inputs */}
			<Input
				placeholder="Nome"
				value={form.name}
				onChange={(e) => setForm({ ...form, name: e.target.value })}
				disabled={loading}
			/>

			<Input
				placeholder="Email"
				value={form.email}
				onChange={(e) => setForm({ ...form, email: e.target.value })}
				disabled={loading}
			/>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{/* 🔥 DELETE COM MODAL */}
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								Excluir
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o usuário <strong>{user?.name}</strong>.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>

								<AlertDialogAction
									onClick={handleDelete}
									className="bg-red-600 hover:bg-red-700"
								>
									{deleteUser.isPending ? "Excluindo..." : "Sim, excluir"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				{/* SUBMIT */}
				<div className="ml-auto">
					<Button type="submit" disabled={loading}>
						{createUser.isPending || updateUser.isPending
							? "Salvando..."
							: isEdit
								? "Atualizar"
								: "Criar"}
					</Button>
				</div>
			</div>
		</form>
	)
}

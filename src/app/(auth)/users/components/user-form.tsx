"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { clientApiClient } from "@/lib/api/client"
import { User } from "@/schemas/user"

interface UserFormProps {
	user?: User
	onSuccess?: () => void
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
	const isEdit = !!user

	const [form, setForm] = useState({
		name: user?.name || "",
		email: user?.email || "",
	})

	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)

		try {
			if (isEdit) {
				await clientApiClient(`/users/${user.id}`, {
					method: "PUT",
					body: JSON.stringify(form),
				})
			} else {
				await clientApiClient(`/users`, {
					method: "POST",
					body: JSON.stringify(form),
				})
			}

			onSuccess?.()
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<Input
				placeholder="Nome"
				value={form.name}
				onChange={(e) => setForm({ ...form, name: e.target.value })}
			/>

			<Input
				placeholder="Email"
				value={form.email}
				onChange={(e) => setForm({ ...form, email: e.target.value })}
			/>

			<Button type="submit" disabled={loading}>
				{isEdit ? "Atualizar" : "Criar"}
			</Button>
		</form>
	)
}

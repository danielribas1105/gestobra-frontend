"use client"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStatementMutations } from "@/hooks/statements/use-statement-mutations"
import { Statement } from "@/schemas/statements"
import { useState } from "react"

interface StatementFormProps {
	statement?: Statement
	onSuccess?: () => void
}

export default function StatementForm({
	statement,
	onSuccess,
}: StatementFormProps) {
	const isEdit = !!statement

	const { createStatement, updateStatement, deleteStatement } =
		useStatementMutations()

	const [form, setForm] = useState({
		id: statement?.id || "",
		job_id: statement?.job_id || "",
	})

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()

		try {
			if (isEdit) {
				await updateStatement.mutateAsync({
					id: statement!.id,
					data: form,
				})
			} else {
				await createStatement.mutateAsync(form)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!statement) return

		try {
			await deleteStatement.mutateAsync(statement.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createStatement.isPending ||
		updateStatement.isPending ||
		deleteStatement.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Inputs */}
			<Input
				placeholder="Nome"
				value={form.id}
				onChange={(e) => setForm({ ...form, id: e.target.value })}
				disabled={loading}
			/>

			<Input
				placeholder="Descrição"
				value={form.job_id}
				onChange={(e) => setForm({ ...form, job_id: e.target.value })}
				disabled={loading}
			/>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{/* 🔥 DELETE COM MODAL */}
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteStatement.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Você quer realmente excluir?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o trabalho <strong>{statement?.id}</strong>.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>

								<AlertDialogAction
									onClick={handleDelete}
									className="bg-red-600 hover:bg-red-700"
								>
									Sim, excluir
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				{/* SUBMIT */}
				<div className="ml-auto">
					<Button type="submit" disabled={loading}>
						{createStatement.isPending || updateStatement.isPending
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

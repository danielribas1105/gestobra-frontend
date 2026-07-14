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
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useStatementMutations } from "@/hooks/statements/use-statement-mutations"
import { Statement, StatementStatusEnum } from "@/schemas/statement"
import { useState } from "react"

interface StatementFormProps {
	statement?: Statement
	onSuccess?: () => void
	onCancel?: () => void
	onStatementCreated?: (statement: Statement) => void
}

const STATUS_LABELS: Record<
	(typeof StatementStatusEnum.options)[number],
	string
> = {
	concluded: "Concluído",
	in_progress: "Em andamento",
	pending: "Pendente",
	canceled: "Cancelado",
}

export default function StatementForm({
	statement,
	onSuccess,
	onCancel,
	onStatementCreated,
}: StatementFormProps) {
	const isEdit = !!statement

	const { createStatement, updateStatement, deleteStatement } =
		useStatementMutations()

	const [form, setForm] = useState({
		code: statement?.code ?? "",
		status: statement?.status ?? ("pending" as Statement["status"]),
		active: statement?.active ?? true,
	})

	function handleChange(field: keyof typeof form, value: string | boolean) {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()
		e.stopPropagation()

		const payload = {
			code: form.code,
			status: form.status,
			active: form.active,
		}

		try {
			if (isEdit) {
				await updateStatement.mutateAsync({ id: statement!.id, data: payload })
			} else {
				const created = await createStatement.mutateAsync(payload)
				onStatementCreated?.(created)
			}
			onSuccess?.()
		} catch {}
	}

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
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-3 gap-2">
				<div className="space-y-1">
					<Label htmlFor="code-mtr">Código MTR</Label>
					<Input
						id="code-mtr"
						placeholder="Digite o código do MTR"
						value={form.code}
						onChange={(e) => handleChange("code", e.target.value)}
						disabled={loading}
						required
					/>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-2">
				<div className="space-y-1">
					<Label htmlFor="status">Status</Label>
					<Select
						value={form.status}
						onValueChange={(value) =>
							handleChange("status", value as Statement["status"])
						}
						disabled={loading}
					>
						<SelectTrigger>
							<SelectValue placeholder="Selecione o status" />
						</SelectTrigger>
						<SelectContent>
							{StatementStatusEnum.options.map((status) => (
								<SelectItem key={status} value={status}>
									{STATUS_LABELS[status]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex justify-between items-center">
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
									permanentemente o manifesto <strong>{statement?.code}</strong>
									.
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

				<div className="flex items-center gap-2 ml-auto">
					<Button
						type="button"
						variant="outline"
						disabled={loading}
						onClick={onCancel}
					>
						Cancelar
					</Button>
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

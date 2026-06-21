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
import { usePaymentMutations } from "@/hooks/payments/use-payment-mutations"
import { useStatementByJob } from "@/hooks/statements/use-statements"
import { Payment } from "@/schemas/payment"
import { parseValueM3 } from "@/utils/format-numbers"
import { useState } from "react"

interface PaymentFormProps {
	payment?: Payment
	onSuccess?: () => void
	onCancel?: () => void
}

const STATUS_LABELS: Record<string, string> = {
	pending: "Pendente",
	paid: "Pago",
	canceled: "Cancelado",
}

export default function PaymentForm({
	payment,
	onSuccess,
	onCancel,
}: PaymentFormProps) {
	const isEdit = !!payment
	const { createPayment, updatePayment, deletePayment } = usePaymentMutations()
	const { data: statement, isLoading: loadingStatement } = useStatementByJob(
		payment?.job_id,
	)

	const [form, setForm] = useState({
		job_id: payment?.job_id || "",
		m3: payment?.m3 ? String(payment.m3).replace(".", ",") : "",
		value_m3: payment?.value_m3
			? String(payment.value_m3).replace(".", ",")
			: "",
		total: payment?.total ? String(payment.total).replace(".", ",") : "",
		status: payment?.status || "pending",
	})

	function handleChange(field: keyof typeof form, value: string) {
		setForm((f) => ({ ...f, [field]: value }))
	}

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()

		const payload = {
			m3: parseValueM3(form.m3),
			value_m3: parseValueM3(form.value_m3),
			total: parseValueM3(form.total),
		}

		try {
			if (isEdit) {
				await updatePayment.mutateAsync({
					id: payment!.id,
					data: payload,
				})
			} else {
				await createPayment.mutateAsync(payload)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!payment) return

		try {
			await deletePayment.mutateAsync(payment!.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createPayment.isPending ||
		updatePayment.isPending ||
		deletePayment.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="flex gap-2 items-center space-y-1">
				<Label htmlFor="nome_material">MTR</Label>
				<Input
					id="nome_material"
					placeholder="Nome"
					value={statement?.code}
					disabled
				/>
			</div>

			<div className="grid grid-cols-3 gap-2">
				<div className="space-y-1">
					<Label htmlFor="quantidade-m3">M3</Label>
					<Input
						id="quantidade-m3"
						placeholder="Quantidade M3"
						value={form.m3}
						onChange={(e) => setForm({ ...form, m3: e.target.value })}
						disabled
					/>
				</div>

				<div className="space-y-1">
					<Label htmlFor="valor-m3">Valor por m3 *</Label>
					<Input
						id="valor-m3"
						placeholder="Valor m3"
						value={form.value_m3}
						onChange={(e) => setForm({ ...form, value_m3: e.target.value })}
						disabled
					/>
				</div>

				<div className="space-y-1.5">
					<Label>Status</Label>
					<Select
						value={form.status}
						onValueChange={(v) =>
							setForm({
								...form,
								status: v as "pending" | "paid" | "canceled",
							})
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(STATUS_LABELS).map(([key, label]) => (
								<SelectItem key={key} value={key}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{/* 🔥 DELETE COM MODAL */}
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deletePayment.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Você quer realmente excluir?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o pagamento <strong>{payment?.id}</strong>.
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

				{/* SUBMIT OR CANCEL */}
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
						{createPayment.isPending || updatePayment.isPending
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

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { usePaymentMutations } from "@/hooks/payments/use-payment-mutations"
import { Payment } from "@/schemas/payment"
import { Loader2 } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import ListPayments from "./list-payments"
import { getPaymentColumns } from "./payment-columns"

interface PaymentsWrapperProps {
	payments: Payment[]
	isLoading: boolean
	onSaved?: () => void
}

interface PendingChange {
	status: Payment["status"]
	updated_at: Payment["updated_at"]
}

export default function PaymentsWrapper({
	payments,
	isLoading,
	onSaved,
}: PaymentsWrapperProps) {
	const { updatePaymentsBatchStatus, deletePayment } = usePaymentMutations()
	const [pendingChanges, setPendingChanges] = useState<
		Record<string, PendingChange>
	>({})
	const [isSaving, setIsSaving] = useState(false)

	const hasChanges = Object.keys(pendingChanges).length > 0

	// Pagamentos com as alterações pendentes aplicadas (apenas para exibição)
	const displayPayments = useMemo(
		() =>
			payments.map((p) =>
				pendingChanges[p.id] !== undefined
					? { ...p, ...pendingChanges[p.id] }
					: p,
			),
		[payments, pendingChanges],
	)

	const handleStatusChange = useCallback(
		(paymentId: string, checked: boolean) => {
			const original = payments.find((p) => p.id === paymentId)
			const newStatus: Payment["status"] = checked ? "paid" : "pending"

			setPendingChanges((prev) => {
				// Se voltou ao valor original, remove das pendências
				if (original?.status === newStatus) {
					const { [paymentId]: _, ...rest } = prev
					return rest
				}
				return {
					...prev,
					[paymentId]: {
						status: newStatus,
						updated_at: checked ? new Date() : (original?.updated_at ?? null),
					},
				}
			})
		},
		[payments],
	)

	// 🗑️ DELETE - centralizado aqui, usado pela tabela (desktop) e pelos cards (mobile)
	const handleDeletePayment = useCallback(
		async (paymentId: string) => {
			try {
				await deletePayment.mutateAsync(paymentId)
				// remove qualquer alteração pendente órfã do pagamento excluído
				setPendingChanges((prev) => {
					const { [paymentId]: _, ...rest } = prev
					return rest
				})
				onSaved?.()
			} catch {
				// toast no onError
			}
		},
		[deletePayment, onSaved],
	)

	async function handleSave() {
		const updates = Object.entries(pendingChanges).map(([id, changes]) => ({
			id,
			status: changes.status,
			updated_at: new Date(),
		}))

		try {
			await updatePaymentsBatchStatus.mutateAsync({ updates })
			setPendingChanges({})
			onSaved?.()
		} catch {
			// toast no onError
		}
	}

	function handleDiscard() {
		setPendingChanges({})
	}

	const columns = useMemo(
		() =>
			getPaymentColumns(
				handleStatusChange,
				pendingChanges,
				handleDeletePayment,
				deletePayment.isPending,
			),
		[
			handleStatusChange,
			pendingChanges,
			handleDeletePayment,
			deletePayment.isPending,
		],
	)

	return (
		<div className="w-full space-y-4">
			{isLoading ? (
				<div className="text-sm text-muted-foreground">
					<Skeleton className="h-12 w-full rounded-md" />
				</div>
			) : (
				<>
					{/* Desktop: payment by car table */}
					<DataTable
						columns={columns}
						data={displayPayments}
						getRowClassName={(payment) =>
							payment.status === "paid" ? "opacity-60" : ""
						}
					/>
					{/* Mobile: cards payment by car */}
					<ListPayments
						payments={displayPayments ?? []}
						onStatusChange={handleStatusChange}
						pendingChanges={pendingChanges}
						onDelete={handleDeletePayment}
						isDeleting={deletePayment.isPending}
					/>
				</>
			)}

			{hasChanges && (
				<div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
					<p className="text-sm text-yellow-800">
						{Object.keys(pendingChanges).length} pagamento(s) com alterações não
						salvas
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleDiscard}
							disabled={isSaving}
						>
							Descartar
						</Button>
						<Button size="sm" onClick={handleSave} disabled={isSaving}>
							{isSaving ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Salvando...
								</>
							) : (
								"Salvar alterações"
							)}
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}

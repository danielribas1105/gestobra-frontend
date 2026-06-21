import ModalWrapper from "@/components/layout/modal-wrapper"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { usePaymentMutations } from "@/hooks/payments/use-payment-mutations"
import { Payment } from "@/schemas/payment"
import { Loader2 } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { getPaymentColumns } from "./payment-columns"
import PaymentForm from "./payment-form"
import { Skeleton } from "@/components/ui/skeleton"

interface PaymentsByCarWrapperProps {
	paymentsList: Payment[]
	isLoading: boolean
	onSaved?: () => void
}

interface PendingChange {
	status: Payment["status"]
	updated_at: Payment["updated_at"]
}

export default function PaymentsByCarWrapper({
	paymentsList,
	isLoading,
	onSaved,
}: PaymentsByCarWrapperProps) {
	const { updatePaymentsBatchStatus } = usePaymentMutations()
	const [pendingChanges, setPendingChanges] = useState<
		Record<string, PendingChange>
	>({})
	const [isSaving, setIsSaving] = useState(false)
	const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(
		undefined,
	)

	const hasChanges = Object.keys(pendingChanges).length > 0

	// Pagamentos com as alterações pendentes aplicadas (apenas para exibição)
	const displayPayments = useMemo(
		() =>
			paymentsList.map((p) =>
				pendingChanges[p.id] !== undefined
					? { ...p, ...pendingChanges[p.id] }
					: p,
			),
		[paymentsList, pendingChanges],
	)

	function closeFormModal() {
		setSelectedPayment(undefined)
	}

	const handleStatusChange = useCallback(
		(paymentId: string, checked: boolean) => {
			const original = paymentsList.find((p) => p.id === paymentId)
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
		[paymentsList],
	)

	function handleRowClickPayment(paymentByCar: Payment) {
		if (paymentByCar.status === "paid") return
		setSelectedPayment(paymentByCar)
	}

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
		() => getPaymentColumns(handleStatusChange, pendingChanges),
		[handleStatusChange, pendingChanges],
	)

	return (
		<>
			<div className="w-full space-y-4">
				{isLoading ? (
					<div className="text-sm text-muted-foreground">
						<Skeleton className="h-6 w-full rounded-md" />
						<Skeleton className="h-6 w-full rounded-md" />
						<Skeleton className="h-6 w-full rounded-md" />
					</div>
				) : (
					<DataTable
						columns={columns}
						data={displayPayments}
						onRowClick={(paymentByCar) => handleRowClickPayment(paymentByCar)}
						getRowClassName={(payment) =>
							payment.status === "paid" ? "cursor-default opacity-60" : ""
						}
					/>
				)}

				{hasChanges && (
					<div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
						<p className="text-sm text-yellow-800">
							{Object.keys(pendingChanges).length} pagamento(s) com alterações
							não salvas
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

			<ModalWrapper
				open={!!selectedPayment}
				onOpenChange={(v) => {
					if (!v) closeFormModal()
				}}
				width="50vw"
				maxHeight="50vh"
				title={
					selectedPayment ? "Excluir/Editar pagamento" : "Adicionar pagamento"
				}
				description={
					selectedPayment
						? "Exclua ou edite as informações do pagamento"
						: "Preencha as informações do novo pagamento e clique em salvar"
				}
			>
				<PaymentForm
					payment={selectedPayment}
					onSuccess={closeFormModal}
					onCancel={closeFormModal}
				/>
			</ModalWrapper>
		</>
	)
}

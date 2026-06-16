import { DataTable } from "@/components/ui/data-table"
import { Payment } from "@/schemas/payment"
import { useState, useCallback, useMemo } from "react"
import { getPaymentColumns } from "./payment-columns"
import ModalWrapper from "@/components/layout/modal-wrapper"
import PaymentForm from "./payment-form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PaymentsByCarModalProps {
	paymentsList: Payment[]
	isLoading: boolean
	onSaved?: () => void
}

interface PendingChange {
	status: Payment["status"]
	updated_at: Payment["updated_at"]
}

export default function PaymentsByCarModal({
	paymentsList,
	isLoading,
	onSaved,
}: PaymentsByCarModalProps) {
	const [payments, setPayments] = useState<Payment[]>(paymentsList)
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

	async function handleSave() {
		setIsSaving(true)
		try {
			await Promise.all(
				Object.entries(pendingChanges).map(([id, changes]) =>
					fetch(`/api/payments/${id}`, {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(changes), // { status, updated_at }
					}),
				),
			)

			// Confirma as alterações no estado principal
			/* setPayments((prev) =>
				prev.map((p) =>
					pendingChanges[p.id] !== undefined
						? { ...p, ...pendingChanges[p.id] }
						: p,
				),
			) */
			setPendingChanges({})
			onSaved?.()
		} catch (error) {
			console.error("Erro ao salvar:", error)
		} finally {
			setIsSaving(false)
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
					<p className="text-sm text-muted-foreground">
						Carregando pagamentos...
					</p>
				) : (
					<DataTable
						columns={columns}
						data={displayPayments}
						onRowClick={(paymentByCar) => setSelectedPayment(paymentByCar)}
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

import { Payment } from "@/schemas/payment"
import PaymentCard from "./payment-card"

interface PendingChange {
	status: Payment["status"]
	updated_at: Payment["updated_at"]
}

interface ListPaymentsProps {
	payments: Payment[]
	onStatusChange: (paymentId: string, checked: boolean) => void
	pendingChanges: Record<string, PendingChange>
	onDelete: (paymentId: string) => void
	isDeleting: boolean
}

export default function ListPayments({
	payments,
	onStatusChange,
	pendingChanges,
	onDelete,
	isDeleting,
}: ListPaymentsProps) {
	if (payments.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-8 text-center gap-2">
				<span className="text-2xl">📋</span>
				<p className="text-sm font-medium text-foreground">
					Nenhum pagamento encontrado
				</p>
				<p className="text-xs text-muted-foreground">
					Os pagamentos cadastradas aparecerão aqui
				</p>
			</div>
		)
	}

	return (
		<div className="md:hidden flex flex-col gap-3">
			{payments.map((payment) => (
				<PaymentCard
					key={payment.job_id}
					payment={payment}
					onStatusChange={onStatusChange}
					pendingChanges={pendingChanges}
					onDelete={onDelete}
					isDeleting={isDeleting}
				/>
			))}
		</div>
	)
}

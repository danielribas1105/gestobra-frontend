import { Payment } from "@/schemas/payment"
import PaymentCard from "./payment-card"
import MobileList from "@/components/ui/mobile-list"

interface PendingChange {
	status: Payment["status"]
	updated_at: Payment["updated_at"]
}

interface ListPaymentsProps {
	payments: Payment[]
	onStatusChange: (paymentId: string, checked: boolean) => void
	pendingChanges: Record<string, PendingChange>
}

export default function ListPayments({
	payments,
	onStatusChange,
	pendingChanges,
}: ListPaymentsProps) {
	return (
		<MobileList
			items={payments}
			getKey={(payment) => payment.job_id}
			emptyTitle="Nenhum pagamento encontrado"
			emptyDescription="Os pagamentos cadastradas aparecerão aqui"
			renderItem={(payment) => (
				<PaymentCard
					payment={payment}
					onStatusChange={onStatusChange}
					pendingChanges={pendingChanges}
				/>
			)}
		/>
	)
}

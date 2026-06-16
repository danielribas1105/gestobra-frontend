import { DataTable } from "@/components/ui/data-table"
import { usePaymentsSummaryByCar } from "@/hooks/payments/use-payments"
import { PaymentByCar } from "@/schemas/payment"
import { useState } from "react"
import { PaymentColumnsByCar } from "./payments-columns-by-car"
import PaymentsModal from "./payments-modal"

export default function ListPayments() {
	const [selectedPayment, setSelectedPayment] = useState<
		PaymentByCar | undefined
	>(undefined)
	const { data: summaryByCar, isLoading } = usePaymentsSummaryByCar()

	if (isLoading) return <p>Carregando...</p>

	if (summaryByCar?.length === 0) {
		return <div>Nenhum pagamento encontrado!</div>
	}

	return (
		<>
			<div className="w-full">
				<DataTable
					columns={PaymentColumnsByCar}
					data={summaryByCar ?? []}
					onRowClick={(paymentByCar) => setSelectedPayment(paymentByCar)}
				/>
			</div>
			<PaymentsModal
				open={!!selectedPayment}
				onOpenChange={(p) => {
					if (!p) setSelectedPayment(undefined)
				}}
				paymentByCar={selectedPayment}
			/>
		</>
	)
}

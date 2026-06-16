"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { usePaymentsByLicense } from "@/hooks/payments/use-payments"
import { PaymentByCar } from "@/schemas/payment"
import PaymentsByCarModal from "./payments-by-car-modal"

interface PaymentsModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	paymentByCar?: PaymentByCar
}

export default function PaymentsModal({
	open,
	onOpenChange,
	paymentByCar,
}: PaymentsModalProps) {
	const {
		data: paymentsByCarList,
		isLoading,
		refetch,
	} = usePaymentsByLicense(paymentByCar?.license ?? "")

	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			width="80vw"
			maxHeight="90vh"
			title={`Pagamentos ${paymentByCar ? ` - ${paymentByCar.model} / ${paymentByCar.license}` : ""}`}
			description="Selecione para editar ou excluir pagamentos deste veículo"
		>
			<PaymentsByCarModal
				key={paymentByCar?.license}
				paymentsList={paymentsByCarList ?? []}
				isLoading={isLoading}
				onSaved={refetch}
			/>
		</ModalWrapper>
	)
}

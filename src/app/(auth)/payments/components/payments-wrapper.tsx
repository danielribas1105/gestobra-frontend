"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { usePaymentsByLicense } from "@/hooks/payments/use-payments"
import { PaymentByCar } from "@/schemas/payment"
import PaymentsByCarWrapper from "./payments-by-car-wrapper"

interface PaymentsWrapperProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	paymentByCar?: PaymentByCar
}

export default function PaymentsWrapper({
	open,
	onOpenChange,
	paymentByCar,
}: PaymentsWrapperProps) {
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
			<PaymentsByCarWrapper
				key={paymentByCar?.license}
				paymentsList={paymentsByCarList ?? []}
				isLoading={isLoading}
				onSaved={refetch}
			/>
		</ModalWrapper>
	)
}

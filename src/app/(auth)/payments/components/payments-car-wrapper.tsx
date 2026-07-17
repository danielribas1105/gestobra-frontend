"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { usePaymentsByLicense } from "@/hooks/payments/use-payments"
import { PaymentByCar } from "@/schemas/payment"
import PaymentsWrapper from "./payments-wrapper"

interface PaymentsCarWrapperProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	paymentByCar?: PaymentByCar
}

export default function PaymentsCarWrapper({
	open,
	onOpenChange,
	paymentByCar,
}: PaymentsCarWrapperProps) {
	const {
		data: paymentsByCarList,
		isLoading,
		refetch,
	} = usePaymentsByLicense(paymentByCar?.license ?? "")

	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			width="60vw"
			maxHeight="90vh"
			title={`Pagamentos ${paymentByCar ? ` - ${paymentByCar.model} / ${paymentByCar.license}` : ""}`}
			description="Selecione para editar ou excluir pagamentos deste veículo"
		>
			<PaymentsWrapper
				key={paymentByCar?.license}
				payments={paymentsByCarList ?? []}
				isLoading={isLoading}
				onSaved={refetch}
			/>
		</ModalWrapper>
	)
}

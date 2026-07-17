import MobileList from "@/components/ui/mobile-list"
import { PaymentByCar } from "@/schemas/payment"
import PaymentCarCard from "./payment-car-card"

interface ListPaymentsCarProps {
	paymentsCar: PaymentByCar[]
	onPaymentCarClick?: (paymentCar: PaymentByCar) => void
}

export default function ListPaymentsCar({
	paymentsCar,
	onPaymentCarClick,
}: ListPaymentsCarProps) {
	return (
		<MobileList
			items={paymentsCar}
			getKey={(payment) => payment.license}
			emptyTitle="Nenhum pagamento encontrado"
			emptyDescription="Os pagamentos cadastradas aparecerão aqui"
			renderItem={(payment) => (
				<PaymentCarCard paymentCar={payment} onClick={onPaymentCarClick} />
			)}
		/>
	)
}

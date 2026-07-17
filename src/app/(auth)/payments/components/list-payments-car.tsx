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
	if (paymentsCar.length === 0) {
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
			{paymentsCar.map((payment) => (
				<PaymentCarCard
					key={payment.license}
					paymentCar={payment}
					onClick={onPaymentCarClick}
				/>
			))}
		</div>
	)
}

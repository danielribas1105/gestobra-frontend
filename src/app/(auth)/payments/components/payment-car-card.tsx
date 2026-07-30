import LabelCard from "@/components/ui/label-card"
import MobileCardShell from "@/components/ui/mobile-card-shell"
import { PaymentByCar } from "@/schemas/payment"

export interface PaymentCarCardProps {
	paymentCar: PaymentByCar
	onClick?: (paymentCar: PaymentByCar) => void
}

export default function PaymentCarCard({
	paymentCar,
	onClick,
}: PaymentCarCardProps) {
	return (
		<MobileCardShell
			className="w-56 h-48 p-2 gap-2"
			onClick={onClick ? () => onClick(paymentCar) : undefined}
			ariaLabel={`Pagamento total para a placa ${paymentCar.license}`}
			header={
				<header className="flex flex-col items-start h-16">
					<h2 className="text-xl text-secondary-foreground font-semibold">
						{paymentCar.license}
					</h2>
					<p className="text-lg text-muted-foreground font-semibold">
						{paymentCar.model}
					</p>
				</header>
			}
		>
			<div className="flex flex-col gap-2 text-secondary-foreground">
				<LabelCard
					description="Valor já pago pelos transportes realizados"
					label="Pago"
					value={paymentCar.paid.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				/>
				<LabelCard
					description="Valores à pagar"
					label="À pagar"
					value={paymentCar.pending.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				/>
				<LabelCard
					description="Valores cancelados que não serão pagos"
					label="Cancelado"
					value={paymentCar.canceled.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				/>
			</div>
		</MobileCardShell>
	)
}

import LabelCard from "@/components/ui/label-card"
import { PaymentByCar } from "@/schemas/payment"
import { useState } from "react"

export interface PaymentCarCardProps {
	paymentCar: PaymentByCar
	onClick?: (paymentCar: PaymentByCar) => void
}

export default function PaymentCarCard({
	paymentCar,
	onClick,
}: PaymentCarCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="w-56 h-48 border-2 rounded-lg p-2 flex flex-col gap-2 cursor-pointer"
				onClick={() => onClick?.(paymentCar)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Pagamento total para a placa ${paymentCar.license}`}
			>
				<header className="flex flex-col items-start h-16">
					<h2 className="text-xl text-secondary-foreground font-semibold">
						{paymentCar.license}
					</h2>
					<p className="text-lg text-muted-foreground font-semibold">
						{paymentCar.model}
					</p>
				</header>
				<div className="flex flex-col gap-2 text-secondary-foreground">
					<LabelCard
						description="Valor já pago pelos transportes realizados"
						label="Pago"
						value={
							paymentCar.paid.toLocaleString("pt-BR", {
								style: "currency",
								currency: "BRL",
							}) ?? ""
						}
					/>
					<LabelCard
						description="Valores pendentes de pagamento"
						label="Pendente"
						value={
							paymentCar.pending.toLocaleString("pt-BR", {
								style: "currency",
								currency: "BRL",
							}) ?? ""
						}
					/>
					<LabelCard
						description="Valores cancelados que não serão pagos"
						label="Cancelado"
						value={
							paymentCar.canceled.toLocaleString("pt-BR", {
								style: "currency",
								currency: "BRL",
							}) ?? ""
						}
					/>
				</div>
			</article>
		</>
	)
}

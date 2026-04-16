"use client"

import TitlePage from "@/components/layout/title-page"
import { useState } from "react"

export default function PaymentsPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Pagamentos"
				placeholder="Procure pelo placa ou motorista - Ex: oxk8978 ou João da Silva"
				textTooltip="Adicionar pagamento"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">{/*< ListCars /> */}</div>
			{/* <CarModal open={open} onOpenChange={setOpen} /> */}
		</section>
	)
}

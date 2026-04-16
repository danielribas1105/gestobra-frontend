"use client"

import TitlePage from "@/components/layout/title-page"
import { useState } from "react"

export default function MaterialsPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Materiais"
				placeholder="Procure pelo nome - Ex: brita"
				textTooltip="Adicionar material"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">{/*< ListCars /> */}</div>
			{/* <CarModal open={open} onOpenChange={setOpen} /> */}
		</section>
	)
}

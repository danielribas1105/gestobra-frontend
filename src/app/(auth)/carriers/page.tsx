"use client"

import TitlePage from "@/components/layout/title-page"
import { useState } from "react"
import CarrierModal from "./components/carrier-modal"
import ListCarriers from "./components/list-carriers"

export default function CarriersPage() {
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Transportadoras"
				placeholder="Procure pelo nome"
				textTooltip="Adicionar transportadora"
				onAdd={() => setOpen(true)}
			/>
			<div className="flex justify-center">
				<ListCarriers />
			</div>
			<CarrierModal open={open} onOpenChange={setOpen} />
		</section>
	)
}

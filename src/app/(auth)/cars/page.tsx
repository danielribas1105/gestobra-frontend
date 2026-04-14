import TitlePage from "@/components/ui/title-page"

import ListCars from "./components/list-cars"

export default function CarsPage() {
	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Veículos"
				placeholder="Procure pela placa - Ex: oxk8978"
				textTooltip="Adicionar veículo"
				href="/cars/new"
			/>
			<div className="flex justify-center">
				<ListCars />
			</div>
		</section>
	)
}

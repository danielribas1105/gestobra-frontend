import TitlePage from "@/components/ui/title-page"

import ListCars from "./components/list-cars"

export default function CarsPage() {
	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Veículos"
				placeholder="Procure pela placa - Ex: oxk8978"
				textButton="Adicionar Veículo"
			/>
			<div className="flex justify-center">
				<ListCars />
			</div>
		</section>
	)
}

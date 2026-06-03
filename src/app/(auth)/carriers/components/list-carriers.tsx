import { useCarriers } from "@/hooks/carriers/use-carriers"
import { Carrier } from "@/schemas/carrier"
import CarrierCard from "./carrier-card"

export default function ListCarriers() {
	const { data: carriers = [], isLoading } = useCarriers()

	if (isLoading) return <p>Carregando...</p>

	if (carriers.length === 0) {
		return <div>Nenhuma transportadora cadastrada!</div>
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
			{carriers &&
				carriers.map((carrier: Carrier) => (
					<CarrierCard key={carrier.id} carrier={carrier} />
				))}
		</div>
	)
}

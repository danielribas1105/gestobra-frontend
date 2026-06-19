import SummaryCard from "./summary-card"

export default function SummaryWrapper() {
	return (
		<div className="flex flex-col md:flex-row gap-2 items-center justify-around">
			<SummaryCard header="Título" content="Conteúdo" footer="Rodapé" />
			<SummaryCard header="Título" content="Conteúdo" footer="Rodapé" />
			<SummaryCard
				header="Total de Viagens"
				content="Realizadas"
				footer="Pendentes"
			/>
			<SummaryCard header="Pagamentos" content="Pago" footer="Pendente" />
		</div>
	)
}

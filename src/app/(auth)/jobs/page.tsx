import TitlePage from "@/components/ui/title-page"
import ListJobs from "./components/list-jobs"

export default function JobsPage() {
	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Transportes"
				placeholder="Procure pela placa - Ex: oxk8978"
				textButton="Adicionar Transporte"
			/>
			<div className="flex justify-center">
				<ListJobs />
			</div>
		</section>
	)
}

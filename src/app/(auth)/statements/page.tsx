import TitlePage from "@/components/ui/title-page"

import ListStatements from "./components/list-statements"

export default function StatementsPage() {
	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Manifestos"
				placeholder="Procure pelo nome"
				textButton="Adicionar Manifesto"
			/>
			<div className="flex justify-center">
				<ListStatements />
			</div>
		</section>
	)
}

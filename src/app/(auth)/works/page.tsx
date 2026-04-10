import PageLayout from "@/components/ui/page-layout"
import TitlePage from "@/components/ui/title-page"

import ListWorks from "./components/list-works"

export default function WorksPage() {
	return (
		<PageLayout>
			<section className="flex flex-col gap-7">
				<TitlePage
					title="Obras"
					placeholder="Procure pelo nome da obra"
					textButton="Adicionar Obra"
				/>
				<div className="flex justify-center">
					<ListWorks />
				</div>
			</section>
		</PageLayout>
	)
}

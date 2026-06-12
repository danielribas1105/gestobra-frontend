import { Material } from "@/schemas/material"
import { useState } from "react"
import MaterialModal from "./material-modal"
import LabelCard from "@/components/ui/label-card"

export interface MaterialCardProps {
	material: Material
}

export default function MaterialCard({ material }: MaterialCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-28 border-2 rounded-lg p-2 flex flex-col justify-between gap-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary hover:-translate-y-0.5"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do material ${material.name}`}
			>
				<header className="flex gap-3 items-start">
					<div className="flex flex-2/3 flex-col">
						<h2 className="text-xl text-secondary-foreground font-semibold">
							{material.name}
						</h2>
						<p className="text-sm text-muted-foreground">
							{material.description}
						</p>
					</div>
				</header>
				<div className="flex flex-col gap-2 text-secondary-foreground">
					<LabelCard
						description="Ano de fabricação"
						label="Valor M3"
						value={new Intl.NumberFormat("pt-BR", {
							style: "currency",
							currency: "BRL",
						}).format(material.value_m3)}
					/>
				</div>
			</article>
			<MaterialModal open={open} onOpenChange={setOpen} material={material} />
		</>
	)
}

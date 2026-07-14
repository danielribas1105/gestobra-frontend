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
				className="h-48 border-2 rounded-lg p-2 flex flex-col justify-between gap-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary hover:-translate-y-0.5"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do material ${material.name}`}
			>
				<header className="flex gap-3 items-start">
					<h2 className="text-xl text-secondary-foreground font-semibold">
						{material.name}
					</h2>
				</header>
				<div className="flex flex-col gap-2 text-secondary-foreground">
					<LabelCard
						description="Estado físico do material/resíduo"
						label="Estado Físico"
						value={material.state ?? ""}
					/>
					<LabelCard
						description="Classe do material/resíduo"
						label="Classe"
						value={material.material_class ?? ""}
					/>
					<LabelCard
						description="Acondicionamento do material/resíduo"
						label="Acondicionamento"
						value={material.packaging ?? ""}
					/>
					<LabelCard
						description="Utilização para o material/resíduo"
						label="Tecnologia"
						value={material.technology ?? ""}
					/>
				</div>
			</article>
			<MaterialModal open={open} onOpenChange={setOpen} material={material} />
		</>
	)
}

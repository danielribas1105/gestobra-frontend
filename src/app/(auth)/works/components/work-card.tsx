import { Badge } from "@/components/ui/badge"
import { Work } from "@/schemas/work"
import { MapPinHouse } from "lucide-react"
import { useState } from "react"
import WorkModal from "./work-modal"
import { formatDate } from "@/utils/format-date"
import LabelCard from "@/components/ui/label-card"

export interface WorkCardProps {
	work: Work
}

export default function WorkCard({ work }: WorkCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-64 border-2 rounded-lg p-4 flex flex-col gap-2 justify-between cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes da obra ${work.name}`}
			>
				<div className="flex flex-col gap-2 text-secondary-foreground">
					<header className="flex items-start gap-2">
						<MapPinHouse
							className="text-muted-foreground shrink-0 mt-1"
							size={30}
						/>
						<h2 className="text-2xl font-semibold">{work.name}</h2>
					</header>
					<div className="flex flex-col gap-2">
						<LabelCard
							description="Manifesto de transporte de resíduos e rejeitos"
							label="Razão Social"
							value={work.code}
						/>
						<LabelCard
							description="Endereço da obra"
							label="Endereço"
							value={work.address ?? ""}
						/>
					</div>
				</div>
				<footer className="flex items-center justify-between">
					<LabelCard
						description="Data de cadastro da obra"
						label="Cadastro"
						value={formatDate(work.created_at ?? "")}
					/>
					<Badge variant={work.status === "active" ? "default" : "destructive"}>
						{work.status.toUpperCase()}
					</Badge>
				</footer>
			</article>
			<WorkModal open={open} onOpenChange={setOpen} work={work} />
		</>
	)
}

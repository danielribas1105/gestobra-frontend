import { Statement } from "@/schemas/statement"
import { useState } from "react"
import StatementModal from "./statement-modal"
import LabelCard from "@/components/ui/label-card"
import { useMaterial } from "@/hooks/materials/use-materials"
import { useJobsByStatement } from "@/hooks/jobs/use-job-by-statement"

const STATUS_COLORS: Record<Statement["status"], string> = {
	pending: "#F59E0B",
	approved: "#22C55E",
	rejected: "#EF4444",
	in_progress: "#3B82F6",
	concluded: "#8B5CF6",
}

const STATUS_LABELS: Record<Statement["status"], string> = {
	pending: "Pendente",
	approved: "Aprovado",
	rejected: "Rejeitado",
	in_progress: "Em andamento",
	concluded: "Concluído",
}

export interface StatementCardProps {
	statement: Statement
}

export default function StatementCard({ statement }: StatementCardProps) {
	const [open, setOpen] = useState(false)
	const {
		data: job,
		isLoading: loadingJob,
		isError: errorJob,
	} = useJobsByStatement(statement.id)
	const {
		data: material,
		isLoading,
		isError,
	} = useMaterial(statement.material_id)

	return (
		<>
			<article
				className="h-64 border-2 rounded-lg p-3 flex flex-col gap-2 cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do manifesto ${statement.code}`}
			>
				<header className="flex gap-3 items-start">
					<div className="flex flex-2/3 gap-2 items-center">
						<h2 className="text-xl text-muted-foreground font-semibold">
							MTR nº
						</h2>
						<h2 className="text-xl">{statement.code}</h2>
					</div>
				</header>
				<div className="flex flex-col gap-2 text-secondary-foreground">
					<div className="grid grid-cols-2 gap-2">
						<LabelCard
							description="Material transportado"
							label="Material"
							value={material?.name}
						/>
						<LabelCard
							description="M³"
							label="Quantidade (M³)"
							value={statement.m3}
						/>
					</div>
					<LabelCard
						description="Obra de origem"
						label="Origem"
						value={job?.origin_name}
					/>
					<LabelCard
						description="Obra de destino"
						label="Destino"
						value={job?.destiny_name}
					/>
					<LabelCard
						description="Data de criação"
						label="Criado em:"
						value={
							statement.created_at
								? new Date(statement.created_at).toLocaleDateString("pt-BR")
								: "—"
						}
					/>
				</div>

				<footer className="flex items-center gap-2">
					<span
						className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
						style={{ backgroundColor: STATUS_COLORS[statement.status] }}
						aria-hidden="true"
					/>
					<span className="text-xs uppercase font-medium">
						{STATUS_LABELS[statement.status]}
					</span>
				</footer>
			</article>

			<StatementModal
				open={open}
				onOpenChange={setOpen}
				statement={statement}
			/>
		</>
	)
}

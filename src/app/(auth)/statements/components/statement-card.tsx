import { Badge } from "@/components/ui/badge"
import LabelCard from "@/components/ui/label-card"
import { useCarriers } from "@/hooks/carriers/use-carriers"
import { useJobsByStatement } from "@/hooks/jobs/use-job-by-statement"
import { Statement } from "@/schemas/statement"
import { useState } from "react"
import StatementModal from "./statement-modal"

const STATUS_COLORS: Record<Statement["status"], string> = {
	concluded: "#22C55E",
	in_progress: "#3B82F6",
	pending: "#F59E0B",
	canceled: "#EF4444",
}

const STATUS_LABELS: Record<Statement["status"], string> = {
	concluded: "Concluído",
	in_progress: "Em andamento",
	pending: "Pendente",
	canceled: "Cancelado",
}

export interface StatementCardProps {
	statement: Statement
}

export default function StatementCard({ statement }: StatementCardProps) {
	const [open, setOpen] = useState(false)
	const { data: carriers, isLoading: loadingCarrier } = useCarriers()
	const {
		data: job,
		isLoading: loadingJob,
		isError: errorJob,
	} = useJobsByStatement(statement.id)

	const carrier = carriers ? carriers[0].name : ""

	return (
		<>
			<article
				className="md:h-64 border-2 rounded-lg p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-primary transition-colors"
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
				<div className="flex flex-col gap-2">
					<LabelCard
						description="Obra de origem"
						label="Origem"
						value={errorJob ? "Não cadastrado" : job?.origin_name}
						isLoading={loadingJob}
					/>
					<LabelCard
						description="Obra de destino"
						label="Destino"
						value={errorJob ? "Não cadastrado" : job?.destiny_name}
						isLoading={loadingJob}
					/>
					<LabelCard
						description="Transportadora utilizada para a movimentação"
						label="Transportadora"
						value={carrier}
						isLoading={loadingCarrier}
					/>
				</div>

				<footer className="flex items-center justify-between gap-2">
					<LabelCard
						description="Data de criação"
						label="Criado em"
						value={
							statement.created_at
								? new Date(statement.created_at).toLocaleDateString("pt-BR")
								: "—"
						}
					/>
					<Badge
						variant={
							statement.status === "concluded" ? "default" : "destructive"
						}
					>
						{STATUS_LABELS[statement.status].toUpperCase()}
					</Badge>
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

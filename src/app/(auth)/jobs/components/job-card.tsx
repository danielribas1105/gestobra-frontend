import { Badge } from "@/components/ui/badge"
import LabelCard from "@/components/ui/label-card"
import { useCar } from "@/hooks/cars/use-cars"
import { Job } from "@/schemas/job"
import { useState } from "react"
import JobModal from "./job-modal"

const JOBS_COLORS_STATUS: Record<Job["status"], string> = {
	concluded: "#22C55E",
	in_progress: "#3B82F6",
	pending: "#F59E0B",
	canceled: "#EF4444",
}

const JOBS_STATUS: Record<Job["status"], string> = {
	concluded: "Concluído",
	in_progress: "Em andamento",
	pending: "Pendente",
	canceled: "Cancelado",
}

export interface JobCardProps {
	job: Job
}

export default function JobCard({ job }: JobCardProps) {
	const [open, setOpen] = useState(false)
	const { data: car, isLoading: loadingCar } = useCar(job.car_id)

	return (
		<>
			<article
				className="md:h-64 border-2 rounded-lg p-3 flex flex-col gap-2 justify-between cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do job ${job.id}`}
			>
				<header className="flex gap-3 items-center justify-between">
					<div className="flex flex-2/3 gap-2 items-center">
						<h2 className="text-xl text-muted-foreground font-semibold">
							MTR nº
						</h2>
						<h2 className="text-xl">{job.statement_code ?? "Não informado"}</h2>
					</div>
					<LabelCard
						description="Data de criação"
						label="Data"
						value={
							job.created_at
								? new Date(job.created_at).toLocaleDateString("pt-BR")
								: "—"
						}
					/>
				</header>
				<div className="flex flex-col gap-2">
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
						<LabelCard
							description="Material transportado"
							label="Material"
							value={job?.material_name}
						/>
						<LabelCard
							description="Quantidade de resíduos"
							label="Quantidade"
							value={job.quantity}
							position="justify-end md:justify-center"
						/>
						<LabelCard
							description="Valor a ser pago pelo transporte"
							label="Valor"
							value={job.value.toLocaleString("pt-BR", {
								style: "currency",
								currency: "BRL",
							})}
							position="md:justify-end"
						/>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
						<LabelCard
							description="Veículo utilizado no transporte"
							label="Veículo"
							value={car?.model}
							isLoading={loadingCar}
						/>
						<LabelCard
							description="Placa do veículo utilizado"
							label="Placa"
							value={job.car_license ?? ""}
							position="justify-end md:justify-center"
						/>
						<LabelCard
							description="Motorista que realizaou o transporte"
							label="Motorista"
							value={job.driver_name ?? ""}
							position="md:justify-end"
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
				</div>

				<footer className="flex items-center justify-between gap-2">
					<LabelCard
						description="Usuário que criou a movimentação"
						label="Criado por"
						value={job?.creator_name}
					/>
					<Badge
						variant={job.status === "concluded" ? "default" : "destructive"}
					>
						{JOBS_STATUS[job.status].toUpperCase()}
					</Badge>
				</footer>
			</article>
			<JobModal open={open} onOpenChange={setOpen} job={job} />
		</>
	)
}

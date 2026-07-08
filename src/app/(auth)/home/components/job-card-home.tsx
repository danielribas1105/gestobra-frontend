"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { useMaterial } from "@/hooks/materials/use-materials"
import { useStatementByJob } from "@/hooks/statements/use-statements"
import { Job } from "@/schemas/job"

const statusConfig: Record<
	string,
	{ label: string; color: string; bg: string; text: string }
> = {
	pending: {
		label: "Pendente",
		color: "bg-yellow-400",
		bg: "bg-yellow-50",
		text: "text-yellow-700",
	},
	in_progress: {
		label: "Em andamento",
		color: "bg-blue-500",
		bg: "bg-blue-50",
		text: "text-blue-700",
	},
	concluded: {
		label: "Concluído",
		color: "bg-green-500",
		bg: "bg-green-50",
		text: "text-green-700",
	},
	canceled: {
		label: "Cancelado",
		color: "bg-red-500",
		bg: "bg-red-50",
		text: "text-red-700",
	},
}

interface JobCardHomeProps {
	job: Job
	onClick?: (job: Job) => void
}

export default function JobCardHome({ job, onClick }: JobCardHomeProps) {
	const status = statusConfig[job.status] ?? statusConfig["pending"]
	const total = (job.m3 as number) * (job.value_m3 as number)
	const created_at = job.created_at ?? ""
	const date = new Date(created_at).toLocaleDateString("pt-BR")

	const { data: statement, isLoading: loadingStatement } = useStatementByJob(
		job.id,
	)
	const { data: material, isLoading: loadingMaterial } = useMaterial(
		statement?.material_id ?? "",
	)

	return (
		<div
			className="rounded-xl border bg-card p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.99] transition-transform"
			onClick={() => onClick?.(job)}
		>
			{/* Header: manifesto + status badge */}
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-0.5">
					<span className="text-[11px] text-muted-foreground uppercase tracking-wide">
						MTR Nº
					</span>
					{loadingStatement ? (
						<span className="text-sm font-semibold text-foreground">
							<Skeleton className="h-4 w-full rounded-md" />
						</span>
					) : (
						<span className="text-sm font-semibold text-foreground">
							{statement?.code}
						</span>
					)}
				</div>
				<span
					className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
				>
					<span className={`size-2 rounded-full ${status.color}`} />
					{status.label}
				</span>
			</div>

			{/* Route: origin → destiny */}
			<div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
				<div className="flex flex-col flex-1 min-w-0">
					<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
						Origem
					</span>
					<span className="text-xs font-medium text-foreground truncate">
						{job.origin_name}
					</span>
				</div>
				<span className="text-muted-foreground text-sm shrink-0">→</span>
				<div className="flex flex-col flex-1 min-w-0 text-right">
					<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
						Destino
					</span>
					<span className="text-xs font-medium text-foreground truncate">
						{job.destiny_name}
					</span>
				</div>
			</div>

			{/* Details grid */}
			<div className="grid grid-cols-2 gap-x-4 gap-y-2">
				<div className="flex flex-col gap-0.5">
					<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
						Material
					</span>
					{loadingMaterial ? (
						<span className="text-xs text-foreground">
							<Skeleton className="h-4 w-full rounded-md" />
						</span>
					) : (
						<span className="text-xs text-foreground">{material?.name}</span>
					)}
				</div>
				<div className="flex flex-col gap-0.5">
					<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
						M³
					</span>
					<span className="text-xs text-foreground">{job.m3}</span>
				</div>
				<div className="flex flex-col gap-0.5">
					<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
						Motorista
					</span>
					<span className="text-xs text-foreground">{job.driver_name}</span>
				</div>
				<div className="flex flex-col gap-0.5">
					<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
						Veículo
					</span>
					<span className="text-xs text-foreground">{job.car_license}</span>
				</div>
			</div>

			{/* Footer: date + value */}
			<div className="flex items-center justify-between pt-1 border-t border-border/60">
				<span className="text-[11px] text-muted-foreground">{date}</span>
				<span className="text-sm font-semibold text-foreground">
					{total.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				</span>
			</div>
		</div>
	)
}

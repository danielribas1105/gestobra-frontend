"use client"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { useSession } from "@/hooks/auth/use-session"
import { useEffect, useState } from "react"
import { JobColumns } from "./components/job-columns"
import { JobStatusLegend } from "./components/job-status-legend"
import { Skeleton } from "@/components/ui/skeleton"
import { useJobs } from "@/hooks/jobs/use-jobs"
import JobModal from "../jobs/components/job-modal"
import { Job } from "@/schemas/job"

export default function HomePage() {
	const { user, loading } = useSession()
	const router = useRouter()
	const { data: jobs = [], isLoading } = useJobs()
	const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined)

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login")
		}
	}, [loading, user])

	if (loading) {
		return (
			<section className="flex flex-col gap-1">
				<div className="flex gap-2">
					<Skeleton className="flex-1 h-40 w-full rounded-md" />
					<Skeleton className="flex-1 h-40 w-full rounded-md" />
					<Skeleton className="flex-1 h-40 w-full rounded-md" />
					<Skeleton className="flex-1 h-40 w-full rounded-md" />
				</div>
				<div className="flex justify-end">
					<Skeleton className="h-6 w-32 rounded-md" />
				</div>
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
				<Skeleton className="h-6 w-full rounded-md" />
			</section>
		)
	}

	return (
		<section className="flex flex-col gap-3">
			<div className="flex flex-1 gap-2 items-center justify-around">
				<div className="flex-1 flex-col gap-4 border-2 rounded-lg p-3 h-40">
					<div className="text-lg font-semibold mb-2">Título</div>
					<div className="text-muted-foreground">Info 1</div>
					<div className="text-muted-foreground">Info 2</div>
				</div>
				<div className="flex-1 flex-col gap-4 border-2 rounded-lg p-3 h-40">
					<div className="text-lg font-semibold mb-2">Título</div>
					<div className="text-muted-foreground">Info 1</div>
					<div className="text-muted-foreground">Info 2</div>
				</div>
				<div className="flex-1 flex-col gap-4 border-2 rounded-lg p-3 h-40">
					<div className="text-lg font-semibold mb-2">Total de Viagens</div>
					<div className="text-muted-foreground">Realizadas</div>
					<div className="text-muted-foreground">Pendentes</div>
					<div className="text-muted-foreground">Canceladas</div>
				</div>
				<div className="flex-1 flex-col gap-4 border-2 rounded-lg p-3 h-40">
					<div className="text-lg font-semibold mb-2">Pagamentos</div>
					<div className="text-muted-foreground">Pago</div>
					<div className="text-muted-foreground">Pendente</div>
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<div className="flex justify-end">
					<JobStatusLegend />
				</div>
				<DataTable
					columns={JobColumns}
					data={jobs}
					onRowClick={(job) => setSelectedJob(job)}
				/>
			</div>
			<JobModal
				open={!!selectedJob}
				onOpenChange={(v) => {
					if (!v) setSelectedJob(undefined)
				}}
				job={selectedJob}
			/>
		</section>
	)
}

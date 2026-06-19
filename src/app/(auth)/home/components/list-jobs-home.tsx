"use client"
import { Job } from "@/schemas/job"
import JobCardHome from "./job-card-home"

interface ListJobsHomeProps {
	jobs: Job[]
	onJobClick?: (job: Job) => void
}

export default function ListJobsHome({ jobs, onJobClick }: ListJobsHomeProps) {
	if (jobs.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center gap-2">
				<span className="text-2xl">📋</span>
				<p className="text-sm font-medium text-foreground">
					Nenhuma viagem encontrada
				</p>
				<p className="text-xs text-muted-foreground">
					As viagens cadastradas aparecerão aqui.
				</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-3">
			{jobs.map((job) => (
				<JobCardHome key={job.id} job={job} onClick={onJobClick} />
			))}
		</div>
	)
}

import { useJobs } from "@/hooks/jobs/use-jobs"
import { Job } from "@/schemas/job"
import JobCard from "./job-card"
import CardsSkeleton from "@/components/layout/cards-skeleton"

export default function ListJobs() {
	const { data: jobs = [], isLoading } = useJobs()

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<CardsSkeleton key={i} />
				))}
			</div>
		)
	}

	if (jobs.length === 0) {
		return <div>Nenhuma movimentação encontrada!</div>
	}

	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
			{jobs.map((job: Job) => (
				<JobCard key={job.id} job={job} />
			))}
		</div>
	)
}

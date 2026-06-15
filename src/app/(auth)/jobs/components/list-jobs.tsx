import { useJobs } from "@/hooks/jobs/use-jobs"
import { Job } from "@/schemas/job"
import JobCard from "./job-card"
import CardsSkeleton from "@/components/layout/cards-skeleton"

export default function ListJobs() {
	const { data: jobs = [], isLoading } = useJobs()

	const sortedJobs = jobs
		.slice()
		.sort(
			(a, b) =>
				new Date(b.created_at ?? 0).getTime() -
				new Date(a.created_at ?? 0).getTime(),
		)

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<CardsSkeleton key={i} />
				))}
			</div>
		)
	}

	if (sortedJobs.length === 0) {
		return <div>Nenhuma movimentação encontrada!</div>
	}

	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
			{sortedJobs.map((job: Job) => (
				<JobCard key={job.id} job={job} />
			))}
		</div>
	)
}

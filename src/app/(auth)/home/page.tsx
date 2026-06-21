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
import ListJobsHome from "./components/list-jobs-home"
import SummaryWrapper from "./components/summary-wrapper"

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

	if (isLoading) {
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
			<SummaryWrapper />
			<div className="flex flex-col gap-1">
				<div className="md:hidden flex justify-center">
					<p className="text-2xl font-semibold">Movimentações</p>
				</div>
				<div className="hidden md:flex justify-end">
					<JobStatusLegend />
				</div>

				{/* Desktop: tabela normal */}
				<div className="hidden md:block">
					<DataTable
						columns={JobColumns}
						data={jobs}
						onRowClick={(job) => setSelectedJob(job)}
					/>
				</div>

				{/* Mobile: cards */}
				<div className="md:hidden">
					<ListJobsHome jobs={jobs} onJobClick={(job) => setSelectedJob(job)} />
				</div>
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

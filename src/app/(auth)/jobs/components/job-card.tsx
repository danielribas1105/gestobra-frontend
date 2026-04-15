import { Circle } from "lucide-react"
import { Job } from "@/schemas/job"
import { useState } from "react"
import JobModal from "./job-modal"

export interface JobCardProps {
	job: Job
}

export default function JobCard({ job }: JobCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2"
				onClick={() => setOpen(true)}
			>
				<div className="flex flex-col gap-1">
					<header>Job {job.id}</header>
					<section>{job.origin_id}</section>
					<section>{job.destiny_id}</section>
					<footer className="flex items-center gap-1">
						<Circle size={16} color={job.status ? "#00FF00" : "#FF0000"} />
						<span className="text-sm uppercase">
							{job.status ? "Ativo" : "Inativo"}
						</span>
					</footer>
				</div>
			</article>
			<JobModal open={open} onOpenChange={setOpen} job={job} />
		</>
	)
}

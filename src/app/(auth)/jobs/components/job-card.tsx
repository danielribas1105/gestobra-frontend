import { Circle } from "lucide-react"
import Link from "next/link"

import { Job } from "@/schemas/job"

export interface JobCardProps {
	job: Job
}

export default function JobCard({ job }: JobCardProps) {
	return (
		<Link href={`/jobs/${job.id}`}>
			<article className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2">
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
		</Link>
	)
}

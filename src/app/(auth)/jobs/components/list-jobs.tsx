import { cookies } from "next/headers"

import { Job } from "@/schemas/job"
import JobCard from "./job-card"

async function fetchJobs(): Promise<Job[]> {
	const token = (await cookies()).get("auth_token")?.value

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	if (!res.ok) throw new Error("Erro ao buscar transportes")
	return res.json()
}

export default async function ListJobs() {
	const jobs = await fetchJobs()

	if (jobs.length === 0) {
		return <div>Nenhum transporte encontrado!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{jobs && jobs.map((job: Job) => <JobCard key={job.id} job={job} />)}
		</div>
	)
}

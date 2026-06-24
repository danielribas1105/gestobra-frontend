"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Job, JobsCount } from "@/schemas/job"
import { useQuery } from "@tanstack/react-query"

export function useJobs() {
	return useQuery<Job[]>({
		queryKey: ["jobs"],
		queryFn: () => clientApi(routes.jobs.list),
	})
}

export function useJobsCount() {
	return useQuery<JobsCount>({
		queryKey: ["jobs", "count-jobs"],
		queryFn: () => clientApi(routes.jobs.getJobsCount),
	})
}

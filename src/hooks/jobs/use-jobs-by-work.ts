"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Job } from "@/schemas/job"
import { useQuery } from "@tanstack/react-query"

export function useJobsByOriginWork(workId: string | undefined) {
	return useQuery<Job[]>({
		queryKey: ["jobs", "by-work", workId],
		queryFn: () => clientApi(routes.jobs.getJobsByOriginWork(workId!)),
		enabled: !!workId,
	})
}

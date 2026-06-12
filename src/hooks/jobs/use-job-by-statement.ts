"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Job } from "@/schemas/job"
import { useQuery } from "@tanstack/react-query"

export function useJobsByStatement(statementId: string | undefined) {
	return useQuery<Job>({
		queryKey: ["jobs", "by-statement", statementId],
		queryFn: () => clientApi(routes.jobs.getJobByStatement(statementId!)),
		enabled: !!statementId,
	})
}

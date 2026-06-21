"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Statement } from "@/schemas/statement"
import { useQuery } from "@tanstack/react-query"

export function useStatements() {
	return useQuery<Statement[]>({
		queryKey: ["statements"],
		queryFn: () => clientApi(routes.statements.list),
	})
}

export function useStatement(id: string) {
	return useQuery<Statement>({
		queryKey: ["statements", id],
		queryFn: () => clientApi(routes.statements.getById(id)),
		enabled: !!id,
	})
}

export function useStatementByJob(jobId: string | undefined) {
	return useQuery<Statement>({
		queryKey: ["statements", "by-job", jobId],
		queryFn: () => clientApi(routes.statements.getByJobId(jobId!)),
		enabled: !!jobId,
	})
}

export function useStatementsWithoutJob() {
	return useQuery<Statement[]>({
		queryKey: ["statements", "without-job"],
		queryFn: () => clientApi(routes.statements.getListWithoutJob),
	})
}

"use client"
import { useRouter } from "next/navigation"

import { DataTable } from "@/components/ui/data-table"
import { JobTable } from "@/constants/JobTable"
import { useSession } from "@/hooks/auth/use-session"
import { useEffect } from "react"
import { JobColumns } from "./components/job-columns"
import { JobStatusLegend } from "./components/job-status-legend"

export default function HomePage() {
	const { user, loading } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login")
		}
	}, [loading, user])

	if (loading) return <p>Carregando...</p>

	return (
		<section className="flex flex-col gap-1">
			<div className="flex justify-end">
				<JobStatusLegend />
			</div>
			<DataTable columns={JobColumns} data={JobTable} />
		</section>
	)
}

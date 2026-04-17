"use client"
import { useRouter } from "next/navigation"

import { DataTable } from "@/components/ui/data-table"
import { JobTable } from "@/constants/JobTable"
import { useSession } from "@/hooks/auth/use-session"
import { useEffect } from "react"
import { JobColumns } from "./components/job-columns"

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
		<section className="flex flex-col gap-4">
			<div className="flex">
				<div className="flex-1">QUADRO 1</div>
				<div className="flex-1">QUADRO 2</div>
			</div>
			<div className="flex justify-center">
				<DataTable columns={JobColumns} data={JobTable} />
			</div>
		</section>
	)
}

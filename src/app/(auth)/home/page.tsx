"use client"
import { useRouter } from "next/navigation"

import { useSession } from "@/hooks/auth/use-session"
import { useEffect } from "react"

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
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
					Header Home
				</div>
			</header>
			<main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
				Main Home (Autenticado)
			</main>
		</div>
	)
}

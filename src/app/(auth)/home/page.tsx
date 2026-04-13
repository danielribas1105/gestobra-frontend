import { redirect } from "next/navigation"

import { getSession } from "@/lib/auth"

export default async function HomePage() {
	const session = await getSession()
	if (!session) redirect("/login")

	const { user } = session

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
					Header Home
				</div>
			</header>
			<main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
				Main Home
			</main>
		</div>
	)
}

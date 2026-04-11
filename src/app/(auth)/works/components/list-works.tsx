import { cookies } from "next/headers"

import { Work } from "@/schemas/work"

import WorkCard from "./work-card"

async function fetchWorks(): Promise<Work[]> {
	const token = (await cookies()).get("auth_token")?.value

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/works`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	if (!res.ok) throw new Error("Erro ao buscar obras")
	return res.json()
}

export default async function ListWorks() {
	const works = await fetchWorks()

	if (works.length === 0) {
		return <div>Nenhuma obra encontrada!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{works &&
				works.map((work: Work) => <WorkCard key={work.id} work={work} />)}
		</div>
	)
}

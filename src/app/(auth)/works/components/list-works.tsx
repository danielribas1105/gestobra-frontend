"use client"
import { useQuery } from "@tanstack/react-query"

import { Work } from "@/schemas/work"

import WorkCard from "./work-card"

async function fetchWorks(): Promise<Work[]> {
	const res = await fetch("http://localhost:8000/api/v1/works") // ajuste a URL do seu FastAPI
	if (!res.ok) throw new Error("Erro ao buscar obras")
	return res.json()
}

export default function ListWorks() {
	const {
		data: works,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["works"],
		queryFn: fetchWorks,
	})

	if (isLoading) return <p>Carregando obras...</p>
	if (error) return <p>Erro ao carregar obras</p>

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{works &&
				works.map((work: Work) => <WorkCard key={work.id} work={work} />)}
		</div>
	)
}

"use client"
import { useQuery } from "@tanstack/react-query"

import { Statement } from "@/schemas/statements"

import StatementCard from "./statement-card"

async function fetchStatements(): Promise<Statement[]> {
	const res = await fetch("http://localhost:8000/api/v1/statement") // ajuste a URL do seu FastAPI
	if (!res.ok) throw new Error("Erro ao buscar manifesto")
	return res.json()
}

export default function ListStatements() {
	const {
		data: statements,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["statements"],
		queryFn: fetchStatements,
	})

	if (isLoading) return <p>Carregando os Manifestos...</p>
	if (error) return <p>Erro ao carregar Manifestos</p>

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{statements &&
				statements.map((statement: Statement) => (
					<StatementCard key={statement.id} statement={statement} />
				))}
		</div>
	)
}

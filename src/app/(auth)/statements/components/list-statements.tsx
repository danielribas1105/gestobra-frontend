import { cookies } from "next/headers"

import { Statement } from "@/schemas/statements"

import StatementCard from "./statement-card"

async function fetchStatements(): Promise<Statement[]> {
	const token = (await cookies()).get("auth_token")?.value

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statements`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	if (!res.ok) throw new Error("Erro ao buscar manifestos")
	return res.json()
}

export default async function ListStatements() {
	const statements = await fetchStatements()

	if (statements.length === 0) {
		return <div>Nenhum manifesto encontrado!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{statements &&
				statements.map((statement: Statement) => (
					<StatementCard key={statement.id} statement={statement} />
				))}
		</div>
	)
}

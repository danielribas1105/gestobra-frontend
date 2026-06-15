import CardsSkeleton from "@/components/layout/cards-skeleton"
import { useStatements } from "@/hooks/statements/use-statements"
import { Statement } from "@/schemas/statement"
import StatementCard from "./statement-card"

export default function ListStatements() {
	const { data: statements = [], isLoading } = useStatements()

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<CardsSkeleton key={i} />
				))}
			</div>
		)
	}

	if (statements.length === 0) {
		return <div>Nenhum manifesto encontrado!</div>
	}

	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
			{statements &&
				statements.map((statement: Statement) => (
					<StatementCard key={statement.id} statement={statement} />
				))}
		</div>
	)
}

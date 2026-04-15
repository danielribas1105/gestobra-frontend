import { Statement } from "@/schemas/statements"
import { Circle } from "lucide-react"
import { useState } from "react"
import StatementModal from "./statement-modal"

export interface StatementCardProps {
	statement: Statement
}

export default function StatementCard({ statement }: StatementCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2 cursor-pointer"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do job ${statement.id}`}
			>
				<div className="flex flex-col gap-1">
					<header>
						<h2>Manifesto nº {statement.id}</h2>
					</header>
					<dl>
						<dt>Criado</dt>
						<dd>{statement.created_at}</dd>
					</dl>
					<footer className="flex items-center gap-1">
						<Circle
							size={16}
							color={statement.status ? "#00FF00" : "#FF0000"}
							aria-hidden="true"
						/>
						<span className="text-sm uppercase">
							{statement.status ? "Ativo" : "Inativo"}
						</span>
					</footer>
				</div>
			</article>
			<StatementModal
				open={open}
				onOpenChange={setOpen}
				statement={statement}
			/>
		</>
	)
}

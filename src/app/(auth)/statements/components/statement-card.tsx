import { Circle } from "lucide-react"
import Link from "next/link"

import { Statement } from "@/schemas/statements"

export interface StatementCardProps {
	statement: Statement
}

export default function StatementCard({ statement }: StatementCardProps) {
	return (
		<Link href={`/statements/${statement.id}`}>
			<article className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2">
				{/* <div className="relative w-full h-36 flex justify-center overflow-hidden">
					<Image src={statement.image_url} alt="Foto da veiculo" fill className="object-cover rounded-lg" />
				</div> */}
				<div className="flex flex-col gap-1">
					<header>Código: {statement.code}</header>
					<section>{""}</section>
					<footer className="flex items-center gap-1">
						<Circle
							size={16}
							color={statement.status ? "#00FF00" : "#FF0000"}
						/>
						<span className="text-sm uppercase">{statement.status}</span>
					</footer>
				</div>
			</article>
		</Link>
	)
}

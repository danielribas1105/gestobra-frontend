import { Info } from "lucide-react"
import Image from "next/image"
import { Work } from "@/schemas/work"
import { useState } from "react"
import WorkModal from "./work-modal"

export interface WorkCardProps {
	work: Work
}

export default function WorkCard({ work }: WorkCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2"
				onClick={() => setOpen(true)}
			>
				<div className="relative w-full h-36 flex justify-center overflow-hidden">
					<Image
						src={work.image_url}
						alt="Foto da obra"
						fill
						className="object-cover rounded-lg"
					/>
				</div>
				<header>{work.name}</header>
				<section>Código: {work.id}</section>
				<footer className="flex items-center gap-1">
					<Info size={16} color={work.active ? "#00FF00" : "#FF0000"} />
					<span className="text-sm uppercase">{work.active}</span>
				</footer>
			</article>
			<WorkModal open={open} onOpenChange={setOpen} work={work} />
		</>
	)
}

"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export default function AddJobButton() {
	const handleCompare = () => {}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="secondary"
					size="sm"
					disabled={false}
					onClick={handleCompare}
				>
					<Plus />
					Movimentação
				</Button>
			</TooltipTrigger>
			<TooltipContent>Adicionar nova movimentação</TooltipContent>
		</Tooltip>
	)
}

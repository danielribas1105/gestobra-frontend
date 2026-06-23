"use client"

import { Button } from "@/components/ui/button"
import { Construction, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useState } from "react"
import WorkModal from "@/app/(auth)/works/components/work-modal"

export default function AddWorkButton() {
	const [open, setOpen] = useState(false)

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="secondary"
						disabled={false}
						onClick={() => setOpen(true)}
					>
						<Plus className="hidden md:block" />
						<Construction className="block md:hidden" />
						<span className="hidden md:block">Obra</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>Adicionar obra</TooltipContent>
			</Tooltip>
			<WorkModal open={open} onOpenChange={setOpen} />
		</>
	)
}

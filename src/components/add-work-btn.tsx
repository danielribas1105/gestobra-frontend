"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useState } from "react"
import WorkModal from "@/app/(auth)/works/components/work-modal"

export default function AddWorkButton() {
	const [open, setOpen] = useState(false)
	const handleAddWork = () => {}

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="secondary"
						size="sm"
						disabled={false}
						onClick={() => setOpen(true)}
					>
						<Plus />
						Obra
					</Button>
				</TooltipTrigger>
				<TooltipContent>Adicionar obra</TooltipContent>
			</Tooltip>
			<WorkModal open={open} onOpenChange={setOpen} />
		</>
	)
}

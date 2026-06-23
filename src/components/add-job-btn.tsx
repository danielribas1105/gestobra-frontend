"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useState } from "react"
import JobModal from "@/app/(auth)/jobs/components/job-modal"

export default function AddJobButton() {
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
						<ArrowLeftRight className="block md:hidden" />
						<span className="hidden md:block">Movimentação</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>Adicionar movimentação</TooltipContent>
			</Tooltip>
			<JobModal open={open} onOpenChange={setOpen} />
		</>
	)
}

"use client"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "./button"
import Search from "./search"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

interface TitlePageProps {
	title: string
	className?: string
	placeholder?: string
	textButton?: string
	textTooltip?: string
	href?: string
}

export default function TitlePage({
	title,
	className,
	placeholder,
	textButton,
	textTooltip,
	href,
}: TitlePageProps) {
	const router = useRouter()

	return (
		<div
			className={`${className ?? ""} flex justify-between items-center gap-3`}
		>
			<div className="flex flex-1/3 gap-3 items-center">
				<h1 className="text-3xl text-logo-blue-dark font-logo font-bold">
					{title}
				</h1>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="default"
							className="flex gap-2"
							onClick={() => href && router.push(href)}
						>
							<Plus />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>{textTooltip}</p>
					</TooltipContent>
				</Tooltip>
			</div>
			{placeholder && <Search className="flex-1" placeholder={placeholder} />}
		</div>
	)
}

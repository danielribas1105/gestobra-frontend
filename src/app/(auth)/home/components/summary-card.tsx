import { ReactNode } from "react"

interface SummaryCardProps {
	title: string
	children: React.ReactNode
}

export default function SummaryCard({ title, children }: SummaryCardProps) {
	return (
		<div className="flex-col md:flex-1 justify-between gap-4 border-2 rounded-lg p-3 h-40 w-full">
			<div className="text-secondary-foreground text-lg font-semibold mb-2">
				{title}
			</div>
			{children}
		</div>
	)
}

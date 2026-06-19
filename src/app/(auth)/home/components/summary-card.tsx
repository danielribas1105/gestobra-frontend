interface SummaryCardProps {
	header: string
	content: string
	footer: string
}

export default function SummaryCard({
	header,
	content,
	footer,
}: SummaryCardProps) {
	return (
		<div className="flex-col md:flex-1 justify-between gap-4 border-2 rounded-lg p-3 h-40 w-full">
			<div className="text-secondary-foreground text-lg font-semibold mb-2">
				{header}
			</div>
			<div className="text-muted-foreground">{content}</div>
			<div className="text-muted-foreground">{footer}</div>
		</div>
	)
}

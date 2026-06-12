interface LabelCardProps {
	description: string
	label: string
	value: string | number | undefined
}

export default function LabelCard({
	description,
	label,
	value,
}: LabelCardProps) {
	return (
		<dl>
			<dt className="sr-only">{description}</dt>
			<dd className="flex gap-2 items-center">
				<p className="font-semibold text-muted-foreground">{label}:</p>
				<p className="font-semibold">{value}</p>
			</dd>
		</dl>
	)
}

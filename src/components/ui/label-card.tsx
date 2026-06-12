import { Skeleton } from "./skeleton"

interface LabelCardProps {
	description: string
	label: string
	value: string | number | undefined
	isLoading?: boolean
}

export default function LabelCard({
	description,
	label,
	value,
	isLoading,
}: LabelCardProps) {
	return (
		<dl>
			<dt className="sr-only">{description}</dt>
			<dd className="flex gap-2 items-center">
				<p className="font-semibold text-muted-foreground">{label}:</p>
				{isLoading ? (
					<Skeleton className="h-6 w-full rounded-md" />
				) : (
					<p className="font-semibold">{value}</p>
				)}
			</dd>
		</dl>
	)
}

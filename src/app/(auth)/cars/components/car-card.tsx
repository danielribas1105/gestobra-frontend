import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Car } from "@/schemas/car"
import { useState } from "react"
import CarModal from "./car-modal"
import { formatDate } from "@/utils/format-date"

export interface CarCardProps {
	car: Car
}

export default function CarCard({ car }: CarCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-64 border-2 rounded-lg p-4 flex flex-col gap-2 justify-between cursor-pointer"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do veículo ${car.model}`}
			>
				<header className="flex gap-2 items-start h-16">
					<div className="relative w-full h-16 flex-1/3 justify-center overflow-hidden border-2 rounded-md">
						<Image
							src={car.image ?? "/no-image.jpg"}
							alt={`Foto do veículo ${car.model}`}
							fill
							className="object-cover rounded-lg"
						/>
					</div>
					<div className="flex flex-2/3 flex-col">
						<h2 className="text-xl font-semibold">{car.model}</h2>
						<p className="text-lg text-muted-foreground font-semibold">
							{car.license}
						</p>
					</div>
					<Badge variant={car.active ? "default" : "destructive"}>
						{car.active ? "ATIVO" : "INATIVO"}
					</Badge>
				</header>
				<div className="flex flex-col gap-2">
					<dl>
						<dt className="sr-only">Ano de fabricação</dt>
						<dd>Ano: {car.manufacture}</dd>
					</dl>
					<dl>
						<dt className="sr-only">Tipo de combustível</dt>
						<dd>Combustível: {car.fuel}</dd>
					</dl>
				</div>
				<footer className="flex items-center gap-1">
					<p className="font-semibold text-muted-foreground">Desde:</p>
					<p>{formatDate(car.created_at ?? "")}</p>
				</footer>
			</article>
			<CarModal open={open} onOpenChange={setOpen} car={car} />
		</>
	)
}

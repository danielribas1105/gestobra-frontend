import { Circle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Car } from "@/schemas/car"

export interface CarCardProps {
	car: Car
}

export default function CarCard({ car }: CarCardProps) {
	return (
		<Link href={`/cars/${car.id}`}>
			<article className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2 hover:shadow-md transition-shadow">
				<div className="relative w-full h-36 flex justify-center overflow-hidden">
					{car.image ? (
						<Image
							src={car.image}
							alt="Foto do veículo"
							fill
							sizes="(max-width: 768px) 100vw, 224px"
							className="object-cover rounded-lg"
						/>
					) : (
						<div className="w-full h-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
							Sem foto
						</div>
					)}
				</div>
				<div className="flex flex-col gap-1">
					<header className="font-medium truncate">{car.model}</header>
					<section className="text-sm text-muted-foreground">
						Placa: {car.license}
					</section>
					<footer className="flex items-center gap-1">
						<Circle
							size={16}
							fill={car.active ? "#00FF00" : "#FF0000"}
							color={car.active ? "#00FF00" : "#FF0000"}
						/>
						<span className="text-sm uppercase">
							{car.active ? "Ativo" : "Inativo"}
						</span>
					</footer>
				</div>
			</article>
		</Link>
	)
}

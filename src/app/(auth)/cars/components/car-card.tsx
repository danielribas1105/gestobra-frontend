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
			<article className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2">
				<div className="relative w-full h-36 flex justify-center overflow-hidden">
					<Image
						src={car.image}
						alt="Foto da veiculo"
						fill
						sizes="(max-width: 768px) 100vw, 224px"
						className="object-cover rounded-lg"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<header>{car.model}</header>
					<section>Placa: {car.license}</section>
					<footer className="flex items-center gap-1">
						<Circle size={16} color={car.active ? "#00FF00" : "#FF0000"} />
						<span className="text-sm uppercase">{car.active}</span>
					</footer>
				</div>
			</article>
		</Link>
	)
}

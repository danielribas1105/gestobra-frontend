import { cookies } from "next/headers"

import { Car } from "@/schemas/car"

import CarCard from "./car-card"

async function fetchCars(): Promise<Car[]> {
	const token = (await cookies()).get("auth_token")?.value

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	if (!res.ok) throw new Error("Erro ao buscar veículos")
	return res.json()
}

export default async function ListCars() {
	const cars = await fetchCars()

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{cars && cars.map((car: Car) => <CarCard key={car.id} car={car} />)}
		</div>
	)
}

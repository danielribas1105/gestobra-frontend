"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const API_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
const COOKIE_NAME = "auth_token"

export interface CarCreatePayload {
	model: string
	license: string
	manufacture: number | null
	km: number | null
	fuel: string | null
	strength: string | null
	capacity: string | null
	versatility: string | null
	active: boolean
	image: string | null
}

export async function createCar(payload: CarCreatePayload) {
	const token = (await cookies()).get(COOKIE_NAME)?.value

	const res = await fetch(`${API_URL}/cars/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	})

	if (!res.ok) {
		const error = await res
			.json()
			.catch(() => ({ detail: "Erro ao criar veículo" }))
		return { error: error.detail ?? "Erro ao criar veículo" }
	}

	redirect("/cars")
}

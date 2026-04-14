"use client"
import { UUID } from "crypto"
import { Save, X } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import InputForm from "@/components/ui/input-form"
import PageLayout from "@/components/layout/page-layout"
import TitlePage from "@/components/ui/title-page"

export default function EditCar({ params }: { params: { id: string | UUID } }) {
	useEffect(() => {
		async function fetchEditCar() {
			try {
				const res = await fetch(
					`http://127.0.0.1:8000/api/v1/cars/${params.id}`,
				)
				if (!res.ok) throw new Error("Erro ao buscar veículo")
				const car = await res.json()
				console.log("car", car)
			} catch (error) {
				console.error(`Edit car: ${error}`)
				return null
			}
		}

		fetchEditCar()
	}, [params.id])

	return (
		<PageLayout>
			<section className="flex flex-col gap-5">
				<TitlePage title="Editar Veículo" />
				<div className="flex border border-logo-blue-dark/80 rounded-lg p-4 text-logo-blue-dark">
					<div className="relative w-64 h-64 flex justify-center overflow-hidden">
						<Image
							src="/cars/caminhao-basculante-cacamba.jpg"
							alt="Foto da veiculo"
							fill
							className="object-cover rounded-lg"
						/>
					</div>
					<div className="flex flex-col flex-1 gap-2 pl-4 text-[16px]">
						<InputForm label="Nome" widthLabel />
						<div className="flex justify-between items-center">
							<InputForm label="Placa" widthLabel />
							<InputForm label="Satus" />
						</div>
						<InputForm label="Motorista" widthLabel />
						<div className="flex justify-between items-center">
							<InputForm label="Fabricação" widthLabel />
							<InputForm label="Km" />
						</div>
						<div className="flex justify-between items-center">
							<InputForm label="Robustez" widthLabel />
							<InputForm label="Capacidade" />
						</div>
						<InputForm label="Observação" widthLabel />
						<div className="flex gap-4 justify-end mt-2">
							<Button variant="default">
								<Save />
								Salvar
							</Button>
							<Button variant="destructive">
								<X />
								Cancelar
							</Button>
						</div>
					</div>
				</div>
			</section>
		</PageLayout>
	)
}

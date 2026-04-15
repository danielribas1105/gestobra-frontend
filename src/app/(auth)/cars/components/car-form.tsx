"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCarMutations } from "@/hooks/cars/use-car-mutations"

import { Car } from "@/schemas/car"
import { useState } from "react"

interface CarFormProps {
	car?: Car
	onSuccess?: () => void
}

export default function CarForm({ car, onSuccess }: CarFormProps) {
	const isEdit = !!car

	const { createCar, updateCar, deleteCar } = useCarMutations()
	const [openAlert, setOpenAlert] = useState(false)

	const [form, setForm] = useState({
		model: car?.model || "",
		licence: car?.license || "",
	})

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()

		try {
			if (isEdit) {
				await updateCar.mutateAsync({
					id: car!.id,
					data: form,
				})
			} else {
				await createCar.mutateAsync(form)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!car) return

		try {
			await deleteCar.mutateAsync(car.id)
			setOpenAlert(false)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createCar.isPending || updateCar.isPending || deleteCar.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Inputs */}
			<Input
				placeholder="Modelo"
				value={form.model}
				onChange={(e) => setForm({ ...form, model: e.target.value })}
				disabled={loading}
			/>

			<Input
				placeholder="Placa"
				value={form.licence}
				onChange={(e) => setForm({ ...form, licence: e.target.value })}
				disabled={loading}
			/>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{/* 🔥 DELETE COM MODAL */}
				{isEdit && (
					<AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteCar.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o veículo <strong>{car?.model}</strong>.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>

								<AlertDialogAction
									onClick={handleDelete}
									className="bg-red-600 hover:bg-red-700"
								>
									Sim, excluir
									{/* {deleteCar.isPending ? "Excluindo..." : "Sim, excluir"} */}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				{/* SUBMIT */}
				<div className="ml-auto">
					<Button type="submit" disabled={loading}>
						{createCar.isPending || updateCar.isPending
							? "Salvando..."
							: isEdit
								? "Atualizar"
								: "Criar"}
					</Button>
				</div>
			</div>
		</form>
	)
}

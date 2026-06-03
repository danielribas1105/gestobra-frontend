"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Carrier } from "@/schemas/carrier"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCarrierMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createCarrier = useMutation({
		mutationFn: (data: Partial<Carrier>) =>
			clientApi(routes.carriers.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["carriers"] })
			toast.success("Transportadora criada com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar transportadora")
		},
	})

	// UPDATE
	const updateCarrier = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Carrier> }) =>
			clientApi(routes.carriers.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cars"] })
			toast.success("Transportadora atualizada com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Transportadora não encontrada")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteCarrier = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.carriers.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cars"] })
			toast.success("Transportadora excluída 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Transportadora já foi removida")
				return
			}

			toast.error(error.message || "Erro ao excluir transportadora")
		},
	})

	return {
		createCarrier,
		updateCarrier,
		deleteCarrier,
	}
}

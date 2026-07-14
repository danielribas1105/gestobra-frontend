"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Material } from "@/schemas/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useMaterialMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createMaterial = useMutation({
		mutationFn: (data: Partial<Material>) =>
			clientApi(routes.materials.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["materials"] })
			toast.success("Material/resíduo criado com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar material/resíduo")
		},
	})

	// UPDATE
	const updateMaterial = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Material> }) =>
			clientApi(routes.materials.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["materials"] })
			toast.success("Material/resíduo atualizado com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Material/resíduo não encontrado")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteMaterial = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.materials.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["materials"] })
			toast.success("Material/resíduo excluído 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Material/resíduo não encontrado")
				return
			}

			toast.error(error.message || "Erro ao excluir material/resíduo")
		},
	})

	return {
		createMaterial,
		updateMaterial,
		deleteMaterial,
	}
}

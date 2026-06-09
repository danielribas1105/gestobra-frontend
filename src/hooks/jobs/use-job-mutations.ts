"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Job } from "@/schemas/job"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useJobMutations() {
	const queryClient = useQueryClient()

	// CREATE
	const createJob = useMutation({
		mutationFn: (data: Partial<Job>) =>
			clientApi(routes.jobs.create, {
				method: "POST",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] })
			toast.success("Movimentação criada com sucesso 🎉")
		},

		onError: (error: any) => {
			if (error.status === 400) {
				toast.error(error.message)
				return
			}

			toast.error("Erro ao criar movimentação")
		},
	})

	// UPDATE
	const updateJob = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
			clientApi(routes.jobs.update(id), {
				method: "PUT",
				body: JSON.stringify(data),
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] })
			toast.success("Movimentação atualizada com sucesso ✨")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Movimentação não encontrada")
				return
			}

			toast.error(error.message)
		},
	})

	// DELETE
	const deleteJob = useMutation({
		mutationFn: (id: string) =>
			clientApi(routes.jobs.delete(id), {
				method: "DELETE",
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] })
			toast.success("Movimentação excluída 🗑️")
		},

		onError: (error: any) => {
			if (error.status === 404) {
				toast.error("Movimentação não encontrada")
				return
			}

			toast.error(error.message || "Erro ao excluir movimentação")
		},
	})

	return {
		createJob,
		updateJob,
		deleteJob,
	}
}

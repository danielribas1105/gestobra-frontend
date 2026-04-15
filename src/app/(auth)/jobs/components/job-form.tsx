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
import { useJobMutations } from "@/hooks/jobs/use-job-mutations"
import { Job } from "@/schemas/job"
import { useState } from "react"

interface JobFormProps {
	job?: Job
	onSuccess?: () => void
}

export default function JobForm({ job, onSuccess }: JobFormProps) {
	const isEdit = !!job

	const { createJob, updateJob, deleteJob } = useJobMutations()

	const [form, setForm] = useState({
		statement_id: job?.statement_id || "",
		destiny_id: job?.destiny_id || "",
	})

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()

		try {
			if (isEdit) {
				await updateJob.mutateAsync({
					id: job!.id,
					data: form,
				})
			} else {
				await createJob.mutateAsync(form)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!job) return

		try {
			await deleteJob.mutateAsync(job.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createJob.isPending || updateJob.isPending || deleteJob.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Inputs */}
			<Input
				placeholder="Nome"
				value={form.statement_id}
				onChange={(e) => setForm({ ...form, statement_id: e.target.value })}
				disabled={loading}
			/>

			<Input
				placeholder="Descrição"
				value={form.destiny_id}
				onChange={(e) => setForm({ ...form, destiny_id: e.target.value })}
				disabled={loading}
			/>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{/* 🔥 DELETE COM MODAL */}
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteJob.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Você quer realmente excluir?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o trabalho <strong>{job?.origin_id}</strong>.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>

								<AlertDialogAction
									onClick={handleDelete}
									className="bg-red-600 hover:bg-red-700"
								>
									Sim, excluir
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				{/* SUBMIT */}
				<div className="ml-auto">
					<Button type="submit" disabled={loading}>
						{createJob.isPending || updateJob.isPending
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

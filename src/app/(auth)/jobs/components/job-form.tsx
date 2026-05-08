"use client"

import { useState } from "react"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

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
import { Label } from "@/components/ui/label"
import { useJobMutations } from "@/hooks/jobs/use-job-mutations"
import { useWorks } from "@/hooks/works/use-works"
import { useCars } from "@/hooks/cars/use-cars"
import { useUsers } from "@/hooks/users/use-users"
import { useStatements } from "@/hooks/statements/use-statements"
import { Job } from "@/schemas/job"
import { Work } from "@/schemas/work"

interface JobFormProps {
	job?: Job
	/** Quando fornecido, trava a origem nessa obra e impede alteração */
	lockedOriginWork?: Work
	onSuccess?: () => void
	onCancel?: () => void
	onJobCreated?: (job: Job) => void
}

const STATUS_LABELS: Record<string, string> = {
	pending: "Pendente",
	in_progress: "Em andamento",
	completed: "Concluído",
	canceled: "Cancelado",
}

export default function JobForm({
	job,
	lockedOriginWork,
	onSuccess,
	onCancel,
	onJobCreated,
}: JobFormProps) {
	const isEdit = !!job

	const { createJob, updateJob, deleteJob } = useJobMutations()

	const { data: works = [] } = useWorks()
	const { data: cars = [] } = useCars()
	const { data: users = [] } = useUsers()
	const { data: statements = [] } = useStatements()

	const drivers = users.filter((u) => u.profile === "driver")

	const [form, setForm] = useState({
		statement_id: job?.statement_id ?? null,
		origin: job?.origin ?? lockedOriginWork?.id ?? "",
		destiny: job?.destiny ?? "",
		car_id: job?.car_id ?? "",
		driver_id: job?.driver_id ?? "",
		status: job?.status ?? "pending",
	})

	// 🔥 remove origem da lista de destino
	const filteredDestinies = works.filter((w) => w.id !== form.origin)

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		try {
			if (isEdit) {
				await updateJob.mutateAsync({ id: job!.id, data: form })
				onSuccess?.()
			} else {
				const created = await createJob.mutateAsync(form)
				onJobCreated?.(created)
				onSuccess?.()
			}
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
			{/* STATEMENT */}
			<div className="space-y-1.5">
				<Label>Romaneio</Label>
				<Select
					value={form.statement_id ?? ""}
					onValueChange={(v) => setForm({ ...form, statement_id: v || null })}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecione o romaneio" />
					</SelectTrigger>
					<SelectContent>
						{statements.map((s) => (
							<SelectItem key={s.id} value={s.id}>
								{s.code}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* ORIGIN — travado se lockedOriginWork */}
			<div className="space-y-1.5">
				<Label>Origem</Label>
				{lockedOriginWork ? (
					<Input value={lockedOriginWork.name} disabled />
				) : (
					<Select
						value={form.origin}
						onValueChange={(v) =>
							setForm({
								...form,
								origin: v,
								destiny: v === form.destiny ? "" : form.destiny,
							})
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Origem" />
						</SelectTrigger>
						<SelectContent>
							{works.map((w) => (
								<SelectItem key={w.id} value={w.id}>
									{w.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>

			{/* DESTINY */}
			<div className="space-y-1.5">
				<Label>Destino</Label>
				<Select
					value={form.destiny}
					onValueChange={(v) => setForm({ ...form, destiny: v })}
				>
					<SelectTrigger>
						<SelectValue placeholder="Destino" />
					</SelectTrigger>
					<SelectContent>
						{filteredDestinies.map((w) => (
							<SelectItem key={w.id} value={w.id}>
								{w.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* CAR */}
			<div className="space-y-1.5">
				<Label>Veículo</Label>
				<Select
					value={form.car_id}
					onValueChange={(v) => setForm({ ...form, car_id: v })}
				>
					<SelectTrigger>
						<SelectValue placeholder="Veículo" />
					</SelectTrigger>
					<SelectContent>
						{cars.map((c) => (
							<SelectItem key={c.id} value={c.id}>
								{c.model}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* DRIVER */}
			<div className="space-y-1.5">
				<Label>Motorista</Label>
				<Select
					value={form.driver_id}
					onValueChange={(v) => setForm({ ...form, driver_id: v })}
				>
					<SelectTrigger>
						<SelectValue placeholder="Motorista" />
					</SelectTrigger>
					<SelectContent>
						{drivers.map((d) => (
							<SelectItem key={d.id} value={d.id}>
								{d.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* STATUS */}
			<div className="space-y-1.5">
				<Label>Status</Label>
				<Select
					value={form.status}
					onValueChange={(v) =>
						setForm({
							...form,
							status: v as "pending" | "in_progress" | "completed" | "canceled",
						})
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(STATUS_LABELS).map(([key, label]) => (
							<SelectItem key={key} value={key}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* ACTIONS */}
			<div className="flex justify-between items-center">
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteJob.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Excluir transporte?</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete}>
									Confirmar
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				<div className="flex items-center gap-2 ml-auto">
					<Button
						type="button"
						variant="outline"
						disabled={loading}
						onClick={onCancel}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={loading}>
						{loading ? "Salvando..." : isEdit ? "Atualizar" : "Criar"}
					</Button>
				</div>
			</div>
		</form>
	)
}

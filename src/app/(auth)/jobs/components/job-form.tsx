"use client"

import { useRef, useState } from "react"

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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCarriers } from "@/hooks/carriers/use-carriers"
import { useCars } from "@/hooks/cars/use-cars"
import { useJobMutations } from "@/hooks/jobs/use-job-mutations"
import {
	useStatements,
	useStatementsWithoutJob,
} from "@/hooks/statements/use-statements"
import { useUsers } from "@/hooks/users/use-users"
import { useWorks } from "@/hooks/works/use-works"
import { Job } from "@/schemas/job"
import { Statement } from "@/schemas/statement"
import { Work } from "@/schemas/work"
import { AlertTriangle, Plus } from "lucide-react"
import StatementForm from "../../statements/components/statement-form"
import WorkForm from "../../works/components/work-form"
import { JOBS_STATUS_LABELS } from "@/constants/Jobs"

interface JobFormProps {
	job?: Job
	/** Quando fornecido, trava a origem nessa obra e impede alteração */
	lockedOriginWork?: Work
	onSuccess?: () => void
	onCancel?: () => void
	onJobCreated?: (job: Job) => void
}

const EMPTY_FORM = {
	statement_id: null as string | null,
	origin: "",
	destiny: "",
	carrier_id: "",
	car_id: "",
	driver_id: "",
	status: "pending" as "pending" | "concluded" | "in_progress" | "canceled",
}

// Required fields
const REQUIRED_FIELDS: { key: keyof typeof EMPTY_FORM; label: string }[] = [
	{ key: "statement_id", label: "MTR" },
	{ key: "origin", label: "Origem" },
	{ key: "destiny", label: "Destino" },
	{ key: "car_id", label: "Veículo" },
	{ key: "driver_id", label: "Motorista" },
]

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
	const { data: statementsWithoutJob = [] } = useStatementsWithoutJob()
	const { data: carriers = [] } = useCarriers()

	const [openStatementModal, setOpenStatementModal] = useState(false)
	const [openOriginWorkModal, setOpenOriginWorkModal] = useState(false)
	const [openDestinyWorkModal, setOpenDestinyWorkModal] = useState(false)

	// ✅ Dialog empty fields
	const [openIncompleteDialog, setOpenIncompleteDialog] = useState(false)
	const [emptyFieldLabels, setEmptyFieldLabels] = useState<string[]>([])

	const [newStatement, setNewStatement] = useState<Statement | null>(null)

	const drivers = users.filter((u) => u.profile === "driver")

	const statementsForSelect = (() => {
		const base =
			isEdit && job?.statement_id
				? [
						...statements.filter((s) => s.id === job.statement_id),
						...statementsWithoutJob.filter((s) => s.id !== job.statement_id),
					]
				: statementsWithoutJob

		if (newStatement) {
			return [newStatement, ...base.filter((s) => s.id !== newStatement.id)]
		}
		return base
	})()

	const [form, setForm] = useState({
		...EMPTY_FORM,
		statement_id: job?.statement_id ?? null,
		origin: job?.origin ?? lockedOriginWork?.id ?? "",
		destiny: job?.destiny ?? "",
		carrier_id: job?.carrier_id ?? "",
		car_id: job?.car_id ?? "",
		driver_id: job?.driver_id ?? "",
		status: job?.status ?? "pending",
	})

	// 🔥 remove origem da lista de destino
	const filteredDestinies = works.filter((w) => w.id !== form.origin)

	async function saveJob() {
		const payload = {
			...form,
			carrier_id: form.carrier_id || carriers[0]?.id,
		}

		if (!payload.carrier_id) return

		try {
			if (isEdit) {
				await updateJob.mutateAsync({ id: job!.id, data: payload })
				onSuccess?.()
			} else {
				const created = await createJob.mutateAsync(payload)
				onJobCreated?.(created)
				onSuccess?.()
			}
		} catch {}
	}

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		if (isEdit) {
			const empty = REQUIRED_FIELDS.filter(({ key }) => !form[key]).map(
				({ label }) => label,
			)

			if (empty.length > 0) {
				setEmptyFieldLabels(empty)
				setOpenIncompleteDialog(true)
				return // 🛑 aguarda confirmação do usuário
			}
		}

		await saveJob()
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!job) return

		try {
			await deleteJob.mutateAsync(job.id)
			onSuccess?.()
		} catch {}
	}

	const pendingNewWorkRef = useRef<{
		field: "origin" | "destiny"
		work: Work
	} | null>(null)

	const loading =
		createJob.isPending || updateJob.isPending || deleteJob.isPending

	return (
		<>
			{/* ✅ Dialog de confirmação — campos incompletos no modo edit */}
			<AlertDialog
				open={openIncompleteDialog}
				onOpenChange={setOpenIncompleteDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-amber-500" />
							Campos incompletos
						</AlertDialogTitle>
						<AlertDialogDescription asChild>
							<div className="space-y-2">
								<p>Os seguintes campos estão vazios:</p>
								<ul className="list-disc list-inside text-sm text-muted-foreground">
									{emptyFieldLabels.map((label) => (
										<li key={label}>{label}</li>
									))}
								</ul>
								<p>Deseja salvar assim mesmo?</p>
							</div>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Voltar e corrigir</AlertDialogCancel>
						<AlertDialogAction
							onClick={saveJob}
							className="bg-amber-500 hover:bg-amber-600 text-white"
						>
							Salvar assim mesmo
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="grid grid-cols-5 gap-2">
					{/* STATEMENT */}
					<div className="space-y-1">
						<Label>MTR</Label>
						<Select
							value={form.statement_id ?? ""}
							onValueChange={(v) => {
								if (v === "__add_new__") {
									setOpenStatementModal(true)
									return
								}
								setForm({
									...form,
									statement_id: v || null,
								})
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Código MTR" />
							</SelectTrigger>
							<SelectContent>
								{statementsForSelect.map((s) => (
									<SelectItem key={s.id} value={s.id}>
										{s.code}
									</SelectItem>
								))}
								<SelectItem
									value="__add_new__"
									className="text-primary font-medium"
								>
									<span className="flex items-center gap-1">
										<Plus className="w-3.5 h-3.5" />
										Adicionar Manifesto
									</span>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* ORIGIN — travado se lockedOriginWork */}
					<div className="col-span-2 space-y-1">
						<Label>Origem</Label>
						{lockedOriginWork ? (
							<Input value={lockedOriginWork.name} disabled />
						) : (
							<Select
								value={form.origin}
								onValueChange={(v) => {
									if (v === "__add_new__") {
										setOpenOriginWorkModal(true)
										return
									}
									setForm({
										...form,
										origin: v,
										destiny: v === form.destiny ? "" : form.destiny,
									})
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Origem" />
								</SelectTrigger>
								<SelectContent>
									{works.map((w) => (
										<SelectItem key={w.id} value={w.id}>
											{w.name}
										</SelectItem>
									))}
									<SelectItem
										value="__add_new__"
										className="text-primary font-medium"
									>
										<span className="flex items-center gap-1">
											<Plus className="w-3.5 h-3.5" />
											Adicionar obra
										</span>
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					</div>

					{/* DESTINY */}
					<div className="col-span-2 space-y-1">
						<Label>Destino</Label>
						<Select
							value={form.destiny}
							onValueChange={(v) => {
								if (v === "__add_new__") {
									setOpenDestinyWorkModal(true)
									return
								}
								setForm({ ...form, destiny: v })
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Destino" />
							</SelectTrigger>
							<SelectContent>
								{filteredDestinies.map((w) => (
									<SelectItem key={w.id} value={w.id}>
										{w.name}
									</SelectItem>
								))}
								<SelectItem
									value="__add_new__"
									className="text-primary font-medium"
								>
									<span className="flex items-center gap-1.5">
										<Plus className="w-3.5 h-3.5" /> Adicionar obra
									</span>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="grid grid-cols-5 gap-2">
					{/* CARRIER */}
					<div className="col-span-2 space-y-1">
						<Label htmlFor="carrier">Transportadora</Label>
						<Input
							id="carrier"
							placeholder="Transportadora"
							value={carriers[0]?.name ?? ""}
							disabled={true}
						/>
						{/* <Select
							value={form.carrier_id}
							onValueChange={(v) => setForm({ ...form, carrier_id: v })}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Transportadora" />
							</SelectTrigger>
							<SelectContent>
								{carriers.map((c) => (
									<SelectItem key={c.id} value={c.id}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select> */}
					</div>
					{/* CAR */}
					<div className="space-y-1">
						<Label>Veículo</Label>
						<Select
							value={form.car_id}
							onValueChange={(v) => setForm({ ...form, car_id: v })}
						>
							<SelectTrigger className="w-full">
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
					<div className="space-y-1">
						<Label>Motorista</Label>
						<Select
							value={form.driver_id}
							onValueChange={(v) => setForm({ ...form, driver_id: v })}
						>
							<SelectTrigger className="w-full">
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
									status: v as
										| "concluded"
										| "in_progress"
										| "pending"
										| "canceled",
								})
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(JOBS_STATUS_LABELS).map(([key, label]) => (
									<SelectItem key={key} value={key}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
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

				<Dialog open={openStatementModal} onOpenChange={setOpenStatementModal}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Novo Manifesto</DialogTitle>
						</DialogHeader>
						<DialogDescription>Adicionar novo manifesto</DialogDescription>
						<StatementForm
							onStatementCreated={(newStatement) => {
								setNewStatement(newStatement)
								setForm((prev) => ({ ...prev, statement_id: newStatement.id }))
							}}
							onSuccess={() => {
								setOpenStatementModal(false)
							}}
							onCancel={() => {
								setNewStatement(null)
								setOpenStatementModal(false)
							}}
						/>
					</DialogContent>
				</Dialog>

				<Dialog
					open={openOriginWorkModal}
					onOpenChange={setOpenOriginWorkModal}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Nova obra</DialogTitle>
						</DialogHeader>
						<DialogDescription>Adicionar nova obra de origem</DialogDescription>
						<WorkForm
							onWorkCreated={(newWork) => {
								pendingNewWorkRef.current = { field: "origin", work: newWork }
							}}
							onSuccess={() => {
								if (pendingNewWorkRef.current?.field === "origin") {
									const newWork = pendingNewWorkRef.current.work
									setForm((prev) => ({
										...prev,
										origin: newWork.id,
										destiny: prev.destiny === newWork.id ? "" : prev.destiny,
									}))
									pendingNewWorkRef.current = null
								}
								setOpenOriginWorkModal(false)
							}}
							onCancel={() => setOpenOriginWorkModal(false)}
						/>
					</DialogContent>
				</Dialog>

				<Dialog
					open={openDestinyWorkModal}
					onOpenChange={setOpenDestinyWorkModal}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Nova obra</DialogTitle>
						</DialogHeader>
						<DialogDescription>
							Adicionar nova obra de destino
						</DialogDescription>
						<WorkForm
							onWorkCreated={(newWork) => {
								pendingNewWorkRef.current = { field: "destiny", work: newWork }
							}}
							onSuccess={() => {
								if (pendingNewWorkRef.current?.field === "destiny") {
									const newWork = pendingNewWorkRef.current.work
									setForm((prev) => ({ ...prev, destiny: newWork.id }))
									pendingNewWorkRef.current = null
								}
								setOpenDestinyWorkModal(false)
							}}
							onCancel={() => setOpenDestinyWorkModal(false)}
						/>
					</DialogContent>
				</Dialog>
			</form>
		</>
	)
}

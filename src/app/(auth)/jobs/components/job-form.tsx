"use client"

import { useEffect, useRef, useState } from "react"

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
import { JOBS_PAYMENT_TYPE, JOBS_STATUS_LABELS } from "@/constants/Jobs"
import { parseValueM3 } from "@/utils/format-numbers"
import { useMaterials } from "@/hooks/materials/use-materials"
import { Material } from "@/schemas/material"
import MaterialForm from "../../materials/components/material-form"
import { LABEL_M3 } from "@/constants/Materials"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"

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
	origin_id: "",
	destiny_id: "",
	quantity: "",
	carrier_id: "",
	car_id: "",
	driver_id: "",
	status: "pending" as "pending" | "concluded" | "in_progress" | "canceled",
}

// Required fields
const REQUIRED_FIELDS: { key: keyof typeof EMPTY_FORM; label: string }[] = [
	{ key: "statement_id", label: "MTR" },
	{ key: "origin_id", label: "Origem" },
	{ key: "destiny_id", label: "Destino" },
	{ key: "quantity", label: "Quantidade" },
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
	const { data: materials = [], isLoading: isLoadingMaterials } = useMaterials()

	const [openMaterialModal, setOpenMaterialModal] = useState(false)
	const [newMaterial, setNewMaterial] = useState<Material | null>(null)

	const allMaterials = newMaterial
		? [...materials.filter((m) => m.id !== newMaterial.id), newMaterial]
		: materials

	const [openStatementModal, setOpenStatementModal] = useState(false)
	const [openOriginWorkModal, setOpenOriginWorkModal] = useState(false)
	const [openDestinyWorkModal, setOpenDestinyWorkModal] = useState(false)

	// ✅ Dialog empty fields
	const [openInConcludeDialog, setOpenInConcludeDialog] = useState(false)
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
		origin_id: job?.origin_id ?? lockedOriginWork?.id ?? "",
		destiny_id: job?.destiny_id ?? "",
		material_id: job?.material_id ?? "",
		quantity: job?.quantity ? String(job?.quantity).replace(".", ",") : "",
		unit: job?.unit ?? "",
		value_type: job?.value_type ?? "per_quantity",
		rate: job?.rate ? String(job?.rate).replace(".", ",") : "",
		value: job?.value ? String(job?.value).replace(".", ",") : "",
		carrier_id: job?.carrier_id ?? "",
		car_id: job?.car_id ?? "",
		driver_id: job?.driver_id ?? "",
		status: job?.status ?? "pending",
	})

	// 🔥 remove origem da lista de destino
	const filteredDestinies = works.filter((w) => w.id !== form.origin_id)

	async function saveJob() {
		const payload = {
			...form,
			quantity: parseValueM3(form.quantity),
			rate: parseValueM3(form.rate),
			value: parseValueM3(form.value),
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
				setOpenInConcludeDialog(true)
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

	useEffect(() => {
		// per_trip: valor unitário é sempre 1, o usuário digita o valor total da viagem
		if (form.value_type === "per_trip") {
			if (form.rate !== "1") {
				setForm((prev) => ({ ...prev, rate: "1" }))
			}
			return
		}

		// per_quantity / per_km: valor total = valor unitário x quantidade
		const rate = parseValueM3(form.rate)
		const quantity = parseValueM3(form.quantity)

		if (!rate || !quantity || isNaN(rate) || isNaN(quantity)) return

		const total = rate * quantity

		setForm((prev) => ({
			...prev,
			value: total.toFixed(2).replace(".", ","),
		}))
	}, [form.rate, form.quantity, form.value_type])

	return (
		<>
			{/* ✅ Dialog de confirmação — campos incompletos no modo edit */}
			<AlertDialog
				open={openInConcludeDialog}
				onOpenChange={setOpenInConcludeDialog}
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
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
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
								value={form.origin_id}
								onValueChange={(v) => {
									if (v === "__add_new__") {
										setOpenOriginWorkModal(true)
										return
									}
									setForm({
										...form,
										origin_id: v,
										destiny_id: v === form.destiny_id ? "" : form.destiny_id,
									})
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecione a origem" />
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
							value={form.destiny_id}
							onValueChange={(v) => {
								if (v === "__add_new__") {
									setOpenDestinyWorkModal(true)
									return
								}
								setForm({ ...form, destiny_id: v })
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione o destino" />
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

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
					<div className="col-span-3 space-y-1">
						<Label htmlFor="status">Material/Resíduo *</Label>
						<Select
							value={form.material_id}
							disabled={loading}
							onValueChange={(v) => {
								if (v === "__add_new__") {
									setOpenMaterialModal(true)
									return
								}
								setForm({
									...form,
									material_id: v,
								})
							}}
						>
							<SelectTrigger id="status" className="w-full">
								<SelectValue
									placeholder={
										isLoadingMaterials
											? "Carregando materiais/resíduos..."
											: "Selecione o material/resíduo"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{allMaterials.map((material) => (
									<SelectItem key={material.id} value={material.id}>
										{material.name}
									</SelectItem>
								))}
								<SelectItem
									value="__add_new__"
									className="text-primary font-medium"
								>
									<span className="flex items-center gap-1">
										<Plus className="w-3.5 h-3.5" />
										Adicionar Material
									</span>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<Label htmlFor="quantity">Quantidade</Label>
						<Input
							id="quantity"
							type="number"
							placeholder="Informe a quantidade"
							value={form.quantity}
							onChange={(e) => setForm({ ...form, quantity: e.target.value })}
							disabled={loading}
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="unit">Unidade</Label>
						<Select
							value={form.unit}
							onValueChange={(v) =>
								setForm({
									...form,
									unit: v as "m3" | "kg" | "t",
								})
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione a unidade" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="m3">{LABEL_M3}</SelectItem>
								<SelectItem value="kg">kg</SelectItem>
								<SelectItem value="t">t</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
					<div className="space-y-1">
						<Label htmlFor="value_type">Forma de pagamento</Label>
						<Select
							value={form.value_type}
							onValueChange={(v) =>
								setForm({
									...form,
									value_type: v as "per_quantity" | "per_trip" | "per_km",
								})
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Forma de pagamento" />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(JOBS_PAYMENT_TYPE).map(([key, label]) => (
									<SelectItem key={key} value={key}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<Label htmlFor="rate">Valor unitário</Label>
						<Input
							id="rate"
							placeholder="Valor da taxa"
							value={form.rate}
							onChange={(e) => setForm({ ...form, rate: e.target.value })}
							disabled={loading || form.value_type === "per_trip"}
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="value">Valor total</Label>
						<Input
							id="value"
							placeholder="Total"
							value={form.value}
							onChange={(e) => setForm({ ...form, value: e.target.value })}
							disabled={loading || form.value_type !== "per_trip"}
						/>
					</div>
					{/* CAR */}
					<div className="space-y-1">
						<Label>Veículo</Label>
						<Select
							value={form.car_id}
							onValueChange={(v) => setForm({ ...form, car_id: v })}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione o veículo" />
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
								<SelectValue placeholder="Selecione o motorista" />
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
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
					{/* CARRIER */}
					<div className="col-span-4 space-y-1">
						<Label htmlFor="carrier">Transportadora</Label>
						<Input
							id="carrier"
							placeholder="Transportadora"
							value={carriers[0]?.name ?? ""}
							disabled={true}
						/>
						{/* Caso existam outras transportadoras*/}
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

					{/* STATUS */}
					<div className="space-y-1">
						<Label>Status</Label>
						{!form.statement_id ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="inline-block w-full cursor-not-allowed">
										<Select value={form.status} disabled>
											<SelectTrigger className="w-full pointer-events-none">
												<SelectValue placeholder="Status" />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(JOBS_STATUS_LABELS).map(
													([key, label]) => (
														<SelectItem key={key} value={key}>
															{label}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
									</span>
								</TooltipTrigger>
								<TooltipContent>MTR não informado</TooltipContent>
							</Tooltip>
						) : (
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
								disabled={loading}
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
						)}
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
					<DialogContent
						style={{ width: "80vw", maxWidth: "92vw", maxHeight: "90vh" }}
					>
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
										destiny:
											prev.destiny_id === newWork.id ? "" : prev.destiny_id,
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
					<DialogContent
						style={{ width: "80vw", maxWidth: "92vw", maxHeight: "90vh" }}
					>
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
				<Dialog open={openMaterialModal} onOpenChange={setOpenMaterialModal}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Novo Material</DialogTitle>
						</DialogHeader>
						<DialogDescription>Adicionar novo material</DialogDescription>
						<MaterialForm
							onMaterialCreated={(newMaterial) => {
								setNewMaterial(newMaterial)
								setForm((prev) => ({ ...prev, material_id: newMaterial.id }))
							}}
							onSuccess={() => {
								setOpenMaterialModal(false)
							}}
							onCancel={() => {
								setNewMaterial(null)
								setOpenMaterialModal(false)
							}}
						/>
					</DialogContent>
				</Dialog>
			</form>
		</>
	)
}

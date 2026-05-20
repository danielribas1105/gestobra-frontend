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
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useWorkMutations } from "@/hooks/works/use-work-mutations"
import { Work, WorkStatus, WorkStatusEnum } from "@/schemas/work"
import { Job } from "@/schemas/job"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import JobModal from "../../jobs/components/job-modal"

interface WorkFormProps {
	work?: Work
	onSuccess?: () => void
	onCancel?: () => void
}

const STATUS_LABELS: Record<WorkStatus, string> = {
	active: "Ativa",
	inactive: "Inativa",
	paralyzed: "Paralisada",
	blocked: "Bloqueada",
	finished: "Finalizada",
}

type WorkFormState = {
	code: string
	name: string
	cnpj: string
	description: string
	address: string
	zip_code: string
	city: string
	state: string
	status: WorkStatus
}

export default function WorkForm({ work, onSuccess, onCancel }: WorkFormProps) {
	const isEdit = !!work
	const { createWork, updateWork, deleteWork } = useWorkMutations()

	const [form, setForm] = useState<WorkFormState>({
		code: work?.code ?? "",
		name: work?.name ?? "",
		cnpj: work?.cnpj ?? "",
		description: work?.description ?? "",
		address: work?.address ?? "",
		zip_code: work?.zip_code ?? "",
		city: work?.city ?? "",
		state: work?.state ?? "",
		status: work?.status ?? "active",
	})

	const [savedWorkId, setSavedWorkId] = useState<string | null>(
		work?.id ?? null,
	)
	const [jobModalOpen, setJobModalOpen] = useState(false)
	const [createdJobs, setCreatedJobs] = useState<Job[]>([])

	// O botão de movimentação fica habilitado se: é edição (já tem ID) ou se acabou de salvar
	const canAddJob = savedWorkId !== null

	function handleChange(field: keyof WorkFormState, value: string) {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	function handleJobCreated(job: Job) {
		setCreatedJobs((prev) => [...prev, job])
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		try {
			if (isEdit) {
				await updateWork.mutateAsync({ id: work!.id, data: form })
				onSuccess?.()
			} else {
				const created = await createWork.mutateAsync(form)
				setSavedWorkId(created.id)
				// Não chama onSuccess — mantém o form aberto para adicionar movimentações
			}
		} catch {}
	}

	async function handleDelete() {
		if (!work) return
		try {
			await deleteWork.mutateAsync(work.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createWork.isPending || updateWork.isPending || deleteWork.isPending
	const isSaved = !isEdit && savedWorkId !== null // criação já persistida

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-2">
				<div className="grid grid-cols-4 gap-2">
					<div className="space-y-1">
						<Label htmlFor="code">Código ou Razão Social *</Label>
						<Input
							id="code"
							placeholder="Digite o código da obra no MTR"
							value={form.code}
							onChange={(e) => handleChange("code", e.target.value)}
							disabled={loading || isSaved}
							required
						/>
					</div>
					<div className="col-span-2 space-y-1">
						<Label htmlFor="name">Obra *</Label>
						<Input
							id="name"
							placeholder="Nome da obra"
							value={form.name}
							onChange={(e) => handleChange("name", e.target.value)}
							disabled={loading || isSaved}
							required
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="cnpj">CNPJ</Label>
						<Input
							id="cnpj"
							placeholder="Digite apenas números"
							value={form.cnpj}
							onChange={(e) => handleChange("cnpj", e.target.value)}
							disabled={loading || isSaved}
						/>
					</div>
				</div>

				<div className="space-y-1">
					<Label htmlFor="address">Endereço</Label>
					<Input
						id="address"
						placeholder="Rua, número, complemento"
						value={form.address}
						onChange={(e) => handleChange("address", e.target.value)}
						disabled={loading || isSaved}
					/>
				</div>

				<div className="grid grid-cols-4 gap-4">
					<div className="space-y-1">
						<Label htmlFor="zip_code">CEP</Label>
						<Input
							id="zip_code"
							placeholder="Digite apenas números"
							value={form.zip_code}
							onChange={(e) => handleChange("zip_code", e.target.value)}
							disabled={loading || isSaved}
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="city">Cidade</Label>
						<Input
							id="city"
							placeholder="Cidade"
							value={form.city}
							onChange={(e) => handleChange("city", e.target.value)}
							disabled={loading || isSaved}
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="state">Estado</Label>
						<Input
							id="state"
							placeholder="UF"
							value={form.state}
							onChange={(e) => handleChange("state", e.target.value)}
							disabled={loading || isSaved}
							maxLength={2}
							className="uppercase"
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="status">Status *</Label>
						<Select
							value={form.status}
							onValueChange={(value) =>
								handleChange("status", value as WorkStatus)
							}
							disabled={loading || isSaved}
						>
							<SelectTrigger id="status">
								<SelectValue placeholder="Selecione o status" />
							</SelectTrigger>
							<SelectContent>
								{WorkStatusEnum.options.map((status) => (
									<SelectItem key={status} value={status}>
										{STATUS_LABELS[status]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="space-y-1">
					<Label htmlFor="description">Observações</Label>
					<Textarea
						id="description"
						placeholder="Observações gerais"
						value={form.description}
						onChange={(e) => handleChange("description", e.target.value)}
						disabled={loading || isSaved}
						rows={3}
					/>
				</div>

				{/* Footer */}
				<div className="flex justify-between items-center pt-1">
					{/* Esquerda: Delete (edição) | + Movimentação */}
					<div className="flex items-center gap-2">
						{isEdit && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										type="button"
										variant="destructive"
										disabled={loading}
									>
										{deleteWork.isPending ? "Excluindo..." : "Excluir"}
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Você quer realmente excluir?
										</AlertDialogTitle>
										<AlertDialogDescription>
											Essa ação não pode ser desfeita. Isso irá excluir
											permanentemente a obra <strong>{work?.name}</strong>.
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

						<Button
							type="button"
							variant="outline"
							disabled={!canAddJob || loading}
							onClick={() => setJobModalOpen(true)}
						>
							<PlusCircle className="size-4 mr-2" />
							Movimentação
						</Button>
					</div>

					{/* Direita: Cancelar / Salvar ou Fechar */}
					<div className="flex items-center gap-2">
						{isSaved ? (
							<Button type="button" onClick={onSuccess}>
								Fechar
							</Button>
						) : (
							<>
								<Button
									type="button"
									variant="outline"
									disabled={loading}
									onClick={onCancel}
								>
									Cancelar
								</Button>
								<Button type="submit" disabled={loading}>
									{createWork.isPending || updateWork.isPending
										? "Salvando..."
										: isEdit
											? "Atualizar"
											: "Salvar"}
								</Button>
							</>
						)}
					</div>
				</div>
			</form>

			{/* Tabela de movimentações adicionadas */}
			{createdJobs.length > 0 && (
				<div className="mt-4 space-y-2">
					<p className="text-sm font-medium text-muted-foreground">
						Movimentações adicionadas
					</p>
					<div className="rounded-md border overflow-hidden">
						<table className="w-full text-sm">
							<thead className="bg-muted text-muted-foreground">
								<tr>
									<th className="px-3 py-2 text-left font-medium">MTR</th>
									<th className="px-3 py-2 text-left font-medium">Destino</th>
									<th className="px-3 py-2 text-left font-medium">Veículo</th>
									<th className="px-3 py-2 text-left font-medium">Motorista</th>
									<th className="px-3 py-2 text-left font-medium">Status</th>
								</tr>
							</thead>
							<tbody>
								{createdJobs.map((j, i) => (
									<tr
										key={j.id}
										className={i % 2 === 0 ? "bg-background" : "bg-muted/40"}
									>
										<td className="px-3 py-2">{j.statement_id}</td>
										<td className="px-3 py-2">{j.destiny}</td>
										<td className="px-3 py-2">{j.car_id}</td>
										<td className="px-3 py-2">{j.driver_id}</td>
										<td className="px-3 py-2 capitalize">{j.status}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<JobModal
				open={jobModalOpen}
				onOpenChange={setJobModalOpen}
				lockedOriginWork={
					savedWorkId
						? ({ id: savedWorkId, name: form.name } as Work)
						: undefined
				}
				onJobCreated={handleJobCreated}
			/>
		</>
	)
}

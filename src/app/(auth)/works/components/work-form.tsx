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
import { DataTable } from "@/components/ui/data-table"
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
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { JobColumns } from "../../home/components/job-columns"
import { Job } from "@/schemas/job"
import JobModal from "../../jobs/components/job-modal"

interface WorkFormProps {
	work?: Work
	onSuccess?: () => void
	onCancel?: () => void
	onAddStatement?: (workId: string) => void
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

export default function WorkForm({
	work,
	onSuccess,
	onCancel,
	onAddStatement,
}: WorkFormProps) {
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

	// ID da obra recém-criada/atualizada (usado para o botão de movimentação)
	const [savedWorkId, setSavedWorkId] = useState<string | null>(
		work?.id ?? null,
	)
	// Controla se o form está no estado "salvo, aguardando ação de movimentação"
	const [savedWithStatements, setSavedWithStatements] = useState(false)
	// Controla a abertura do modal de confirmação pós-save
	const [confirmOpen, setConfirmOpen] = useState(false)
	// Guarda o payload pendente enquanto o modal está aberto
	const [pendingSubmit, setPendingSubmit] = useState<WorkFormState | null>(null)

	const [jobModalOpen, setJobModalOpen] = useState(false)
	const [createdJobs, setCreatedJobs] = useState<Job[]>([])

	function handleJobCreated(job: Job) {
		setCreatedJobs((prev) => [...prev, job])
	}

	function handleChange(field: keyof WorkFormState, value: string | boolean) {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	// ✏️ Abre o modal de confirmação sem submeter ainda
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		// Edição: salva direto, sem modal de movimentação
		if (isEdit) {
			try {
				await updateWork.mutateAsync({ id: work!.id, data: form })
				onSuccess?.()
			} catch {}
			return
		}

		// Criação: abre modal de confirmação
		setPendingSubmit(form)
		setConfirmOpen(true)
	}

	// ✅ Executa o save de fato (chamado pelo modal)
	async function executeSave(withStatements: boolean) {
		if (!pendingSubmit) return

		try {
			const created = await createWork.mutateAsync(pendingSubmit)

			setSavedWorkId(created.id)
			setConfirmOpen(false)
			setPendingSubmit(null)

			if (withStatements) {
				setSavedWithStatements(true)
			} else {
				onSuccess?.()
			}
		} catch {
			setConfirmOpen(false)
		}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!work) return
		try {
			await deleteWork.mutateAsync(work.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createWork.isPending || updateWork.isPending || deleteWork.isPending

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="grid grid-cols-4 gap-4">
					{/* Código */}
					<div className="space-y-1.5">
						<Label htmlFor="code">Código ou Razão Social *</Label>
						<Input
							id="code"
							placeholder="Digite o código da obra no MTR"
							value={form.code}
							onChange={(e) => handleChange("code", e.target.value)}
							disabled={loading || savedWithStatements}
							required
						/>
					</div>
					{/* Nome */}
					<div className="col-span-2 space-y-1.5">
						<Label htmlFor="name">Obra *</Label>
						<Input
							id="name"
							placeholder="Nome da obra"
							value={form.name}
							onChange={(e) => handleChange("name", e.target.value)}
							disabled={loading || savedWithStatements}
							required
						/>
					</div>
					{/* CNPJ */}
					<div className="space-y-1.5">
						<Label htmlFor="cnpj">CNPJ</Label>
						<Input
							id="cnpj"
							placeholder="Digite apenas números"
							value={form.cnpj}
							onChange={(e) => handleChange("cnpj", e.target.value)}
							disabled={loading || savedWithStatements}
						/>
					</div>
				</div>

				{/* Endereço */}
				<div className="space-y-1.5">
					<Label htmlFor="address">Endereço</Label>
					<Input
						id="address"
						placeholder="Rua, número, complemento"
						value={form.address}
						onChange={(e) => handleChange("address", e.target.value)}
						disabled={loading || savedWithStatements}
					/>
				</div>

				<div className="grid grid-cols-4 gap-4">
					{/* CEP */}
					<div className="space-y-1.5">
						<Label htmlFor="zip_code">CEP</Label>
						<Input
							id="zip_code"
							placeholder="Digite apenas números"
							value={form.zip_code}
							onChange={(e) => handleChange("zip_code", e.target.value)}
							disabled={loading || savedWithStatements}
						/>
					</div>
					{/* Cidade */}
					<div className="space-y-1.5">
						<Label htmlFor="city">Cidade</Label>
						<Input
							id="city"
							placeholder="Cidade"
							value={form.city}
							onChange={(e) => handleChange("city", e.target.value)}
							disabled={loading || savedWithStatements}
						/>
					</div>
					{/* Estado */}
					<div className="space-y-1.5">
						<Label htmlFor="state">Estado</Label>
						<Input
							id="state"
							placeholder="UF"
							value={form.state}
							onChange={(e) => handleChange("state", e.target.value)}
							disabled={loading || savedWithStatements}
							maxLength={2}
							className="uppercase"
						/>
					</div>
					{/* Status */}
					<div className="space-y-1.5">
						<Label htmlFor="status">Status *</Label>
						<Select
							value={form.status}
							onValueChange={(value) =>
								handleChange("status", value as WorkStatus)
							}
							disabled={loading || savedWithStatements}
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

				{/* Descrição */}
				<div className="space-y-1.5">
					<Label htmlFor="description">Observações</Label>
					<Textarea
						id="description"
						placeholder="Observações gerais"
						value={form.description}
						onChange={(e) => handleChange("description", e.target.value)}
						disabled={loading || savedWithStatements}
						rows={3}
					/>
				</div>

				{/* Actions */}
				<div className="flex justify-between items-center pt-1">
					{/* 🔥 DELETE */}
					{isEdit && !savedWithStatements && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button type="button" variant="destructive" disabled={loading}>
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

					{/* SUBMIT / CANCEL / MOVIMENTAÇÃO */}
					<div className="flex items-center gap-2 ml-auto">
						{savedWithStatements ? (
							<>
								<Button type="button" variant="outline" onClick={onSuccess}>
									Fechar
								</Button>
								<Button type="button" onClick={() => setJobModalOpen(true)}>
									<PlusCircle className="size-4 mr-2" />
									Incluir Movimentação
								</Button>
							</>
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
											: "Criar"}
								</Button>
							</>
						)}
					</div>
				</div>
			</form>

			{/* Tabela de jobs inseridos */}
			{createdJobs.length > 0 && (
				<div className="mt-4 space-y-2">
					<p className="text-sm font-medium text-muted-foreground">
						Movimentações adicionadas
					</p>
					<div className="rounded-md border overflow-hidden">
						<table className="w-full text-sm">
							<thead className="bg-muted text-muted-foreground">
								<tr>
									<th className="px-3 py-2 text-left font-medium">Romaneio</th>
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

			{/* Modal de job com origem travada */}
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

			{/* Modal: Deseja incluir movimentações? */}
			<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Incluir movimentações?</AlertDialogTitle>
						<AlertDialogDescription>
							Deseja incluir movimentações para a obra{" "}
							<strong>{form.name}</strong> agora?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => executeSave(false)}
							disabled={loading}
						>
							{loading ? "Salvando..." : "Não, fechar"}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => executeSave(true)}
							disabled={loading}
						>
							{loading ? "Salvando..." : "Sim, incluir"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

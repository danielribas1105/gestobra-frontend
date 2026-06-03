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
import { useCarrierMutations } from "@/hooks/carriers/use-carrier-mutations"
import { Carrier } from "@/schemas/carrier"
import { useState } from "react"

interface CarrierFormProps {
	carrier?: Carrier
	onSuccess?: () => void
	onCancel?: () => void
}

export default function CarrierForm({
	carrier,
	onSuccess,
	onCancel,
}: CarrierFormProps) {
	const isEdit = !!carrier
	const { createCarrier, updateCarrier, deleteCarrier } = useCarrierMutations()
	const [openAlert, setOpenAlert] = useState(false)

	const [form, setForm] = useState({
		code: carrier?.code ?? "",
		name: carrier?.name ?? "",
		cnpj: carrier?.cnpj ?? "",
		phone: carrier?.phone ?? "",
		address: carrier?.address ?? "",
		zip_code: carrier?.zip_code ?? "",
		city: carrier?.city ?? "",
		state: carrier?.state ?? "",
	})

	function handleChange(field: keyof typeof form, value: string | boolean) {
		setForm((f) => ({ ...f, [field]: value }))
	}

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		const payload = {
			...form,
		}

		try {
			if (isEdit) {
				await updateCarrier.mutateAsync({ id: carrier!.id, data: payload })
			} else {
				await createCarrier.mutateAsync(payload)
			}
			onSuccess?.()
		} catch {}
	}

	async function handleDelete() {
		if (!carrier) return
		try {
			await deleteCarrier.mutateAsync(carrier.id)
			setOpenAlert(false)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createCarrier.isPending ||
		updateCarrier.isPending ||
		deleteCarrier.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="grid grid-cols-4 gap-2">
				<div className="space-y-1">
					<Label htmlFor="code">Código ou Razão Social</Label>
					<Input
						id="code"
						placeholder="Digite o código da trasportadora"
						value={form.code}
						onChange={(e) => handleChange("code", e.target.value)}
						disabled={loading}
						required
					/>
				</div>
				<div className="col-span-2 space-y-1">
					<Label htmlFor="name">Nome *</Label>
					<Input
						id="name"
						placeholder="Nome da transportadora"
						value={form.name}
						onChange={(e) => handleChange("name", e.target.value)}
						disabled={loading}
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
						disabled={loading}
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
					disabled={loading}
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
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="city">Cidade</Label>
					<Input
						id="city"
						placeholder="Cidade"
						value={form.city}
						onChange={(e) => handleChange("city", e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="state">Estado</Label>
					<Input
						id="state"
						placeholder="UF"
						value={form.state}
						onChange={(e) => handleChange("state", e.target.value)}
						disabled={loading}
						maxLength={2}
						className="uppercase"
					/>
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center justify-between">
				{isEdit && (
					<AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteCarrier.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente a transportadora{" "}
									<strong>{carrier?.name}</strong>.
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

				{/* SUBMIT OR CANCEL */}
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
						{createCarrier.isPending || updateCarrier.isPending
							? "Salvando..."
							: isEdit
								? "Atualizar"
								: "Criar Transportadora"}
					</Button>
				</div>
			</div>
		</form>
	)
}

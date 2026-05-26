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
import { useMaterialMutations } from "@/hooks/materials/use-material-mutations"
import { Material } from "@/schemas/material"
import { useState } from "react"

interface MaterialFormProps {
	material?: Material
	onSuccess?: () => void
	onCancel?: () => void
}

export default function MaterialForm({
	material,
	onSuccess,
	onCancel,
}: MaterialFormProps) {
	const isEdit = !!material

	const { createMaterial, updateMaterial, deleteMaterial } =
		useMaterialMutations()

	const [form, setForm] = useState({
		name: material?.name || "",
		description: material?.description || "",
		value_m3: material?.value_m3
			? String(material.value_m3).replace(".", ",")
			: "",
	})

	function parseValueM3(raw: string): number {
		// "1.234,56" → 1234.56  |  "10,50" → 10.50  |  "10.50" → 10.50
		const normalized = raw.trim().replace(/\./g, "").replace(",", ".")
		const parsed = parseFloat(normalized)
		return isNaN(parsed) ? 0 : parsed
	}

	// ✏️ CREATE / UPDATE
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()

		const payload = {
			name: form.name,
			description: form.description,
			value_m3: parseValueM3(form.value_m3),
		}

		try {
			if (isEdit) {
				await updateMaterial.mutateAsync({
					id: material!.id,
					data: payload,
				})
			} else {
				await createMaterial.mutateAsync(payload)
			}

			onSuccess?.()
		} catch {}
	}

	// 🗑️ DELETE
	async function handleDelete() {
		if (!material) return

		try {
			await deleteMaterial.mutateAsync(material.id)
			onSuccess?.()
		} catch {}
	}

	const loading =
		createMaterial.isPending ||
		updateMaterial.isPending ||
		deleteMaterial.isPending

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Inputs */}
			<div className="space-y-1">
				<Label htmlFor="nome_material">Tipo de material *</Label>
				<Input
					id="nome_material"
					placeholder="Nome"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					disabled={loading}
				/>
			</div>

			<div className="space-y-1">
				<Label htmlFor="descricao_material">Descrição</Label>
				<Input
					id="descricao_material"
					placeholder="Descrição"
					value={form.description}
					onChange={(e) => setForm({ ...form, description: e.target.value })}
					disabled={loading}
				/>
			</div>

			<div className="space-y-1">
				<Label htmlFor="valor_material">Valor por m3 *</Label>
				<Input
					id="valor_material"
					placeholder="Valor m3"
					value={form.value_m3}
					onChange={(e) => setForm({ ...form, value_m3: e.target.value })}
					disabled={loading}
				/>
			</div>

			{/* Actions */}
			<div className="flex justify-between items-center">
				{/* 🔥 DELETE COM MODAL */}
				{isEdit && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={loading}>
								{deleteMaterial.isPending ? "Excluindo..." : "Excluir"}
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Você quer realmente excluir?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Essa ação não pode ser desfeita. Isso irá excluir
									permanentemente o material <strong>{material?.name}</strong>.
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
						{createMaterial.isPending || updateMaterial.isPending
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

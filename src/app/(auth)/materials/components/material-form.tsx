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
	onMaterialCreated?: (material: Material) => void
}

export default function MaterialForm({
	material,
	onSuccess,
	onCancel,
	onMaterialCreated,
}: MaterialFormProps) {
	const isEdit = !!material

	const { createMaterial, updateMaterial, deleteMaterial } =
		useMaterialMutations()

	const [form, setForm] = useState({
		code: material?.code || "",
		name: material?.name || "",
		state: material?.state || "Sólido",
		material_class: material?.material_class || "",
		packaging: material?.packaging || "Caçamba Aberta",
		technology: material?.technology || "Aterro",
	})

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()
		e.stopPropagation()

		const payload = {
			code: form.code,
			name: form.name,
			state: form.state,
			material_class: form.material_class,
			packaging: form.packaging,
			technology: form.technology,
		}

		try {
			if (isEdit) {
				await updateMaterial.mutateAsync({
					id: material!.id,
					data: payload,
				})
			} else {
				const created = await createMaterial.mutateAsync(payload)
				onMaterialCreated?.(created)
			}
			onSuccess?.()
		} catch {}
	}

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
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
				<div className="space-y-1">
					<Label htmlFor="material_code">Código</Label>
					<Input
						id="material_code"
						placeholder="Código material"
						className="text-transform: uppercase"
						value={form.code}
						onChange={(e) =>
							setForm({ ...form, code: e.target.value.toUpperCase() })
						}
						disabled={loading}
					/>
				</div>
				<div className="col-span-3 space-y-1">
					<Label htmlFor="material_name">Nome *</Label>
					<Input
						id="material_name"
						placeholder="Nome do material"
						className="text-transform: uppercase"
						value={form.name}
						onChange={(e) =>
							setForm({ ...form, name: e.target.value.toUpperCase() })
						}
						disabled={loading}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
				<div className="col-span-2 space-y-1">
					<Label htmlFor="state">Estado</Label>
					<Input
						id="state"
						placeholder="Estado físico"
						value={form.state}
						onChange={(e) => setForm({ ...form, state: e.target.value })}
						disabled={loading}
					/>
				</div>
				<div className="col-span-2 space-y-1">
					<Label htmlFor="material_class">Classe</Label>
					<Input
						id="material_class"
						placeholder="Classe do resíduo"
						className="text-transform: uppercase"
						value={form.material_class}
						onChange={(e) =>
							setForm({ ...form, material_class: e.target.value.toUpperCase() })
						}
						disabled={loading}
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
				<div className="col-span-2 space-y-1">
					<Label htmlFor="packaging">Acondicionamento</Label>
					<Input
						id="packaging"
						placeholder="Modo de transporte"
						value={form.packaging}
						onChange={(e) => setForm({ ...form, packaging: e.target.value })}
						disabled={loading}
					/>
				</div>
				<div className="col-span-2 space-y-1">
					<Label htmlFor="technology">Tecnologia</Label>
					<Input
						id="technology"
						placeholder="Utilização para o resíduo"
						value={form.technology}
						onChange={(e) => setForm({ ...form, technology: e.target.value })}
						disabled={loading}
					/>
				</div>
			</div>

			<div className="flex justify-between items-center">
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
									permanentemente o material/resíduo{" "}
									<strong>{material?.name}</strong>.
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

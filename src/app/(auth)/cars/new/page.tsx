"use client"

import { Save, Upload, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import InputForm from "@/components/ui/input-form"
import PageLayout from "@/components/ui/page-layout"
import TitlePage from "@/components/ui/title-page"
import { createCar } from "../actions"

const FUEL_OPTIONS = ["Diesel", "Gasolina", "Etanol", "Elétrico", "GNV", "Flex"]

interface CarFormData {
	model: string
	license: string
	manufacture: string
	km: string
	fuel: string
	strength: string
	capacity: string
	versatility: string
	active: boolean
	image: string | null
}

const initialForm: CarFormData = {
	model: "",
	license: "",
	manufacture: "",
	km: "",
	fuel: "",
	strength: "",
	capacity: "",
	versatility: "",
	active: true,
	image: null,
}

export default function NewCar() {
	const router = useRouter()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [form, setForm] = useState<CarFormData>(initialForm)
	const [preview, setPreview] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [serverError, setServerError] = useState<string | null>(null)
	const [errors, setErrors] = useState<
		Partial<Record<keyof CarFormData, string>>
	>({})

	function handleChange(field: keyof CarFormData, value: string | boolean) {
		setForm((prev) => ({ ...prev, [field]: value }))
		if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
		if (serverError) setServerError(null)
	}

	function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		const objectUrl = URL.createObjectURL(file)
		setPreview(objectUrl)
		setForm((prev) => ({ ...prev, image: objectUrl }))
	}

	function validate(): boolean {
		const newErrors: Partial<Record<keyof CarFormData, string>> = {}
		if (!form.model.trim()) newErrors.model = "Nome do modelo é obrigatório"
		if (!form.license.trim()) newErrors.license = "Placa é obrigatória"
		if (form.manufacture && isNaN(Number(form.manufacture)))
			newErrors.manufacture = "Ano inválido"
		if (form.km && isNaN(Number(form.km))) newErrors.km = "KM inválido"
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	async function handleSubmit() {
		if (!validate()) return

		setLoading(true)
		setServerError(null)

		try {
			const result = await createCar({
				model: form.model,
				license: form.license,
				manufacture: form.manufacture ? Number(form.manufacture) : null,
				km: form.km ? Number(form.km) : null,
				fuel: form.fuel || null,
				strength: form.strength || null,
				capacity: form.capacity || null,
				versatility: form.versatility || null,
				active: form.active,
				image: form.image || null,
			})

			// redirect() dentro da action lança internamente — só chega aqui se houver erro
			if (result?.error) {
				setServerError(result.error)
			}
		} catch (error) {
			// redirect() do Next.js lança uma exceção internamente — não é um erro real
			const isRedirect =
				error instanceof Error && error.message.includes("NEXT_REDIRECT")
			if (!isRedirect) {
				setServerError("Erro inesperado ao criar veículo")
				console.error(error)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<PageLayout>
			<section className="flex flex-col gap-5">
				<TitlePage title="Novo Veículo" />

				<div className="flex border border-logo-blue-dark/80 rounded-lg p-4 text-logo-blue-dark">
					{/* Image upload */}
					<div className="flex flex-col items-center gap-2">
						<div
							className="relative w-64 h-64 flex justify-center overflow-hidden cursor-pointer group rounded-lg border-2 border-dashed border-logo-blue-dark/40 hover:border-logo-blue-dark transition-colors"
							onClick={() => fileInputRef.current?.click()}
						>
							{preview ? (
								<Image
									src={preview}
									alt="Preview do veículo"
									fill
									className="object-cover rounded-lg"
								/>
							) : (
								<div className="flex flex-col items-center justify-center w-full h-full gap-2 text-logo-blue-dark/50 group-hover:text-logo-blue-dark transition-colors">
									<Upload size={32} />
									<span className="text-sm text-center px-4">
										Clique para adicionar uma foto
									</span>
								</div>
							)}

							{preview && (
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
									<div className="flex flex-col items-center gap-1 text-white">
										<Upload size={24} />
										<span className="text-sm">Trocar foto</span>
									</div>
								</div>
							)}
						</div>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleImageChange}
						/>
					</div>

					{/* Form fields */}
					<div className="flex flex-col flex-1 gap-2 pl-4 text-[16px]">
						<InputForm
							label="Nome"
							widthLabel
							value={form.model}
							onChange={(e) => handleChange("model", e.target.value)}
							error={errors.model}
						/>

						<div className="flex justify-between items-start">
							<InputForm
								label="Placa"
								widthLabel
								value={form.license}
								onChange={(e) =>
									handleChange("license", e.target.value.toUpperCase())
								}
								error={errors.license}
								placeholder="ABC1D23"
							/>
							<div className="flex flex-col gap-1">
								<span className="text-sm font-medium">Status</span>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => handleChange("active", !form.active)}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
											form.active ? "bg-green-500" : "bg-red-400"
										}`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												form.active ? "translate-x-6" : "translate-x-1"
											}`}
										/>
									</button>
									<span className="text-sm">
										{form.active ? "Ativo" : "Inativo"}
									</span>
								</div>
							</div>
						</div>

						<div className="flex justify-between items-start">
							<InputForm
								label="Fabricação"
								widthLabel
								value={form.manufacture}
								onChange={(e) => handleChange("manufacture", e.target.value)}
								error={errors.manufacture}
								placeholder="2022"
								type="number"
							/>
							<InputForm
								label="Km"
								value={form.km}
								onChange={(e) => handleChange("km", e.target.value)}
								error={errors.km}
								placeholder="0"
								type="number"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Combustível</label>
							<select
								value={form.fuel}
								onChange={(e) => handleChange("fuel", e.target.value)}
								className="border border-input rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
							>
								<option value="">Selecione...</option>
								{FUEL_OPTIONS.map((f) => (
									<option key={f} value={f}>
										{f}
									</option>
								))}
							</select>
						</div>

						<div className="flex justify-between items-start">
							<InputForm
								label="Robustez"
								widthLabel
								value={form.strength}
								onChange={(e) => handleChange("strength", e.target.value)}
							/>
							<InputForm
								label="Capacidade"
								value={form.capacity}
								onChange={(e) => handleChange("capacity", e.target.value)}
							/>
						</div>

						<InputForm
							label="Versatilidade"
							widthLabel
							value={form.versatility}
							onChange={(e) => handleChange("versatility", e.target.value)}
						/>

						{serverError && (
							<p className="text-sm text-destructive text-right">
								{serverError}
							</p>
						)}

						<div className="flex gap-4 justify-end mt-2">
							<Button
								variant="default"
								onClick={handleSubmit}
								disabled={loading}
							>
								<Save />
								{loading ? "Salvando..." : "Salvar"}
							</Button>
							<Button
								variant="destructive"
								onClick={() => router.back()}
								disabled={loading}
							>
								<X />
								Cancelar
							</Button>
						</div>
					</div>
				</div>
			</section>
		</PageLayout>
	)
}

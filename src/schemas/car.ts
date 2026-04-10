import { z } from "zod"

export const CarSchema = z.object({
	id: z.uuid(),
	model: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	license: z
		.string()
		.regex(/^\d{3}-\d{4}$/, "A placa deve estar no formato XXX-XXXX"),
	/* .refine(validateCPF, "Placa inválida"), */
	driver_id: z.string(),
	manufacture: z.number(),
	km: z.number(),
	fuel: z.string(),
	strength: z.boolean(),
	capacity: z.string(),
	versatility: z.string(),
	active: z.boolean(),
	image_url: z.string(),
	/* imagemURL: z.url().optional(), */
})

// Gerar o tipo TypeScript automaticamente
export type Car = z.infer<typeof CarSchema>

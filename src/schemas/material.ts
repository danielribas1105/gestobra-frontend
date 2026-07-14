import z from "zod"

export const MaterialSchema = z.object({
	id: z.uuid(),
	code: z.string().nullable().optional(),
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	state: z.string().nullable().optional(),
	material_class: z.string().nullable().optional(),
	packaging: z.string().nullable().optional(),
	technology: z.string().nullable().optional(),
})

export type Material = z.infer<typeof MaterialSchema>

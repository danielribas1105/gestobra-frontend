import z from "zod"

export const StatementStatusEnum = z.enum([
	"pending",
	"approved",
	"rejected",
	"concluded",
])

export const StatementShema = z.object({
	id: z.uuid(),
	code: z.string().min(3, "O código deve ter pelo menos 3 caracteres"),
	material_id: z.uuid(),
	m3: z.number().positive("A quantidade de m3 deve ser um número positivo"),
	active: z.boolean().optional(),
	status: StatementStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
})

export type Statement = z.infer<typeof StatementShema>

export const StatementsTotal = z.object({
	approved: z.number(),
	pending: z.number(),
	rejected: z.number(),
	concluded: z.number(),
})

export type StatementsCount = z.infer<typeof StatementsTotal>

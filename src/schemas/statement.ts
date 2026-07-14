import z from "zod"

export const StatementStatusEnum = z.enum([
	"concluded",
	"in_progress",
	"pending",
	"canceled",
])

export const StatementShema = z.object({
	id: z.uuid(),
	code: z.string().min(3, "O código deve ter pelo menos 3 caracteres"),
	active: z.boolean().optional(),
	status: StatementStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
})

export type Statement = z.infer<typeof StatementShema>

export const StatementsTotal = z.object({
	concluded: z.number(),
	in_progress: z.number(),
	pending: z.number(),
	canceled: z.number(),
})

export type StatementsCount = z.infer<typeof StatementsTotal>

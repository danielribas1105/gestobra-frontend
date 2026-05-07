import { z } from "zod"

export const WorkStatusEnum = z.enum([
	"active",
	"inactive",
	"paralyzed",
	"blocked",
	"finished",
])

export type WorkStatus = z.infer<typeof WorkStatusEnum>

export const WorkSchema = z.object({
	id: z.uuid(),
	code: z.string().min(3, "A razão social deve ter pelo menos 3 caracteres"),
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	cnpj: z.string().max(14, "O CNPJ possui 14 dígitos"),
	description: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	address: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	zip_code: z.string().max(8, "O CEP possui 8 dígitos").nullable().optional(),
	city: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	state: z
		.string()
		.min(3, "A descrição deve ter pelo menos 3 caracteres")
		.nullable()
		.optional(),
	status: WorkStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
})

export type Work = z.infer<typeof WorkSchema>

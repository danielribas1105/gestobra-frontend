import z from "zod"

export const JobStatusEnum = z.enum([
	"concluded",
	"in_progress",
	"pending",
	"canceled",
])

export const ValueTypeEnum = z.enum(["per_quantity", "per_trip", "per_km"])

export const JobSchema = z.object({
	id: z.uuid(),
	statement_id: z.uuid().nullable().optional(),
	origin_id: z.uuid(),
	destiny_id: z.uuid(),
	material_id: z.uuid(),
	quantity: z
		.number()
		.positive("A quantidade de resíduo deve ser um número positivo"),
	unit: z.string().nullable().optional(),
	value_type: ValueTypeEnum,
	rate: z.number().positive("O valor unitário deve ser um número positivo"),
	value: z.number().positive("O valor total deve ser um número positivo"),
	car_id: z.uuid(),
	carrier_id: z.uuid(),
	driver_id: z.uuid(),
	created_by: z.uuid(),
	status: JobStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	statement_code: z.string(),
	origin_name: z.string(),
	destiny_name: z.string(),
	material_name: z.string(),
	car_license: z.string().nullable().optional(),
	driver_name: z.string().nullable().optional(),
	creator_name: z.string(),
})

export type Job = z.infer<typeof JobSchema>

export const JobsAmounts = z.object({
	concluded: z.number(),
	in_progress: z.number(),
	pending: z.number(),
	canceled: z.number(),
})

export type JobsCount = z.infer<typeof JobsAmounts>

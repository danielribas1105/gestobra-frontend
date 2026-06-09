import z from "zod"

export const JobStatusEnum = z.enum([
	"pending",
	"in_progress",
	"completed",
	"canceled",
])

export const JobSchema = z.object({
	id: z.uuid(),
	statement_id: z.uuid().nullable().optional(),
	origin: z.uuid(),
	destiny: z.uuid(),
	car_id: z.uuid(),
	carrier_id: z.uuid(),
	driver_id: z.uuid(),
	created_by: z.uuid(),
	status: JobStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	value_m3: z.number().nullable().optional(),
	m3: z.number().nullable().optional(),
	origin_name: z.string(),
	destiny_name: z.string(),
	car_license: z.string().nullable().optional(),
	driver_name: z.string().nullable().optional(),
	creator_name: z.string(),
})

export type Job = z.infer<typeof JobSchema>

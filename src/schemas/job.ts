import z from "zod"

export const JobStatusEnum = z.enum([
	"pending",
	"in_progress",
	"completed",
	"canceled",
])

export const JobSchema = z.object({
	id: z.uuid(),
	statement_id: z.uuid(),
	origin_id: z.uuid(),
	destiny_id: z.uuid(),
	car_id: z.uuid(),
	driver_id: z.uuid(),
	created_by: z.uuid(),
	status: JobStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
})

export type Job = z.infer<typeof JobSchema>

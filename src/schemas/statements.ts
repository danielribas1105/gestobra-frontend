import z from "zod"

export const StatementShema = z.object({
	id: z.uuid(),
	job_id: z.uuid(),
	status: z.string(),
	created_at: z.string(),
})

export type Statement = z.infer<typeof StatementShema>

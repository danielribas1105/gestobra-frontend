import z from "zod"

export const StatementShema = z.object({
   id: z.uuid(),
   code: z.string(),
   created_at: z.string(),
   status: z.string()
})

export type Statement = z.infer<typeof StatementShema>

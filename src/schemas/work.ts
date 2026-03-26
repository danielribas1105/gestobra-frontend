import { z } from "zod"

export const WorkSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.email(),
  address: z.string(),
  region: z.string(),
  city: z.string(),
  state: z.string(),
  budget: z.float32(),
  active: z.boolean(),
  image_url: z.string(),
  /* imagemURL: z.url().optional(), */
})

// Gerar o tipo TypeScript automaticamente
export type Work = z.infer<typeof WorkSchema>
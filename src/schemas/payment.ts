import z from "zod"

export const PaymentStatusEnum = z.enum(["pending", "paid", "canceled"])

export const PaymentSchema = z.object({
	id: z.uuid(),
	job_id: z.uuid(),
	m3: z.number().positive("A quantidade de m3 deve ser um número positivo"),
	value_m3: z.number().positive("O valor por m3 deve ser um número positivo"),
	total: z.number().positive("O valor total deve ser um número positivo"),
	status: PaymentStatusEnum,
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
})

export type Payment = z.infer<typeof PaymentSchema>

export const PaymentsCarSchema = z.object({
	license: z.string(),
	model: z.string(),
	pending: z.number(),
	paid: z.number(),
	canceled: z.number(),
	total: z.number(),
})

export type PaymentByCar = z.infer<typeof PaymentsCarSchema>

export const PaymentUpdateSchema = z.object({
	id: z.uuid(),
	status: PaymentStatusEnum,
	updated_at: z.coerce.date().nullable().optional(),
})

export type PaymentUpdate = z.infer<typeof PaymentUpdateSchema>

export const PaymentBatchUpdateSchema = z.object({
	updates: z.array(PaymentUpdateSchema),
})

export type PaymentBatchUpdate = z.infer<typeof PaymentBatchUpdateSchema>

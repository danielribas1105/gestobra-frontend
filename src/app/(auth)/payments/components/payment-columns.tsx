"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { useStatementByJob } from "@/hooks/statements/use-statements"
import { cn } from "@/lib/utils"
import { Payment } from "@/schemas/payment"
import { ColumnDef } from "@tanstack/react-table"

interface PendingChange {
	status: Payment["status"]
	updated_at: Payment["updated_at"]
}

export function getPaymentColumns(
	onStatusChange: (paymentId: string, checked: boolean) => void,
	pendingChanges: Record<string, PendingChange>,
): ColumnDef<Payment>[] {
	return [
		{
			id: "select",
			header: () => <div className="text-center">Pago</div>,
			cell: ({ row }) => {
				const payment = row.original
				const isPaid = payment.status === "paid"
				const hasPendingChange = pendingChanges[payment.id] !== undefined // ✅ 1. destacar alterações pendentes

				return (
					<div className="flex justify-center">
						<Checkbox
							checked={isPaid}
							className={cn(
								hasPendingChange &&
									"border-yellow-500 data-[state=checked]:bg-yellow-500",
							)}
							onCheckedChange={(checked) =>
								onStatusChange(payment.id, !!checked)
							}
							onClick={(e) => e.stopPropagation()}
						/>
					</div>
				)
			},
		},
		{
			accessorKey: "created_at",
			header: () => <div className="text-center">Data</div>,
			cell: ({ row }) => {
				const raw = row.getValue("created_at") as string
				const date = new Date(raw)
				return (
					<div className="text-[12px] text-center text-muted-foreground">
						{date.toLocaleDateString("pt-BR")}
					</div>
				)
			},
		},
		{
			accessorKey: "job_id",
			header: () => <div className="text-center">MTR</div>,
			cell: ({ row }) => {
				const jobId = row.getValue("job_id") as string
				const { data: statement, isLoading } = useStatementByJob(jobId)
				return (
					<div className="text-[12px] text-center text-muted-foreground">
						{statement?.code}
					</div>
				)
			},
		},
		{
			accessorKey: "m3",
			header: () => <div className="text-center">M3</div>,
			cell: ({ row }) => {
				return (
					<div className="text-[12px] text-center text-muted-foreground">
						{row.getValue("m3")}
					</div>
				)
			},
		},
		{
			accessorKey: "value_m3",
			header: () => <div className="text-center">Valor</div>,
			cell: ({ row }) => {
				const value = row.getValue("value_m3") as number
				return (
					<div className="text-[12px] text-center text-muted-foreground">
						{value.toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						})}
					</div>
				)
			},
		},
		{
			accessorKey: "total",
			header: () => <div className="text-center">Total</div>,
			cell: ({ row }) => {
				const total = row.getValue("total") as number
				return (
					<div className="text-[12px] text-center text-muted-foreground">
						{total.toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						})}
					</div>
				)
			},
		},
		{
			accessorKey: "status",
			header: () => <div className="text-center">Status</div>,
			cell: ({ row }) => {
				const payment = row.original
				const status = payment.status
				const hasPendingChange = pendingChanges[payment.id] !== undefined

				return (
					<div
						className={cn(
							"text-[12px] text-center font-medium",
							hasPendingChange && "italic text-yellow-600", // ✅ 2. amarelo se pendente
							!hasPendingChange && status === "paid" && "text-green-600",
							!hasPendingChange && status !== "paid" && "text-muted-foreground",
						)}
					>
						{status === "paid" ? "Pago" : "Pendente"}
						{hasPendingChange && " *"}
					</div>
				)
			},
		},
		{
			accessorKey: "updated_at",
			header: () => <div className="text-center">Data Pagamento</div>,
			cell: ({ row }) => {
				const raw = row.getValue("updated_at") as
					| Date
					| string
					| null
					| undefined

				if (!raw)
					return (
						<div className="text-[12px] text-center text-muted-foreground">
							—
						</div>
					)

				const date = raw instanceof Date ? raw : new Date(raw) // ✅ aceita Date ou string

				return (
					<div className="text-[12px] text-center text-muted-foreground">
						{date.toLocaleDateString("pt-BR")}
					</div>
				)
			},
		},
	]
}

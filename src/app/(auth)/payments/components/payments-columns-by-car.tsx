"use client"
import { PaymentByCar } from "@/schemas/payment"
import { ColumnDef } from "@tanstack/react-table"

export const PaymentColumnsByCar: ColumnDef<PaymentByCar>[] = [
	{
		accessorKey: "license",
		header: () => <div className="text-center">Placa</div>,
		cell: ({ row }) => {
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{row.getValue("license")}
				</div>
			)
		},
	},
	{
		accessorKey: "model",
		header: () => <div className="text-center">Modelo</div>,
		cell: ({ row }) => {
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{row.getValue("model")}
				</div>
			)
		},
	},
	{
		accessorKey: "paid",
		header: () => <div className="text-center">Pago</div>,
		cell: ({ row }) => {
			const paid = row.getValue("paid") as number
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{paid.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				</div>
			)
		},
	},
	{
		accessorKey: "pending",
		header: () => <div className="text-center">Pendente</div>,
		cell: ({ row }) => {
			const pending = row.getValue("pending") as number
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{pending.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				</div>
			)
		},
	},
	{
		accessorKey: "canceled",
		header: () => <div className="text-center">Cancelado</div>,
		cell: ({ row }) => {
			const canceled = row.getValue("canceled") as number
			return (
				<div className="text-[12px] text-center text-muted-foreground">
					{canceled.toLocaleString("pt-BR", {
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
]

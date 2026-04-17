"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Job } from "@/schemas/job"

export const JobColumns: ColumnDef<Job>[] = [
	{
		accessorKey: "created_at",
		header: () => <div className="text-center">Data</div>,
		cell: ({ row }) => {
			const date = row.getValue("created_at") as Date
			return (
				<span className="text-[12px] text-muted-foreground">
					{date.toLocaleDateString("pt-BR")}
				</span>
			)
		},
	},
	{
		accessorKey: "statement_id",
		header: () => <div className="text-center">Manifesto</div>,
		cell: ({ row }) => {
			return (
				<span className="text-[12px] text-muted-foreground">
					{row.getValue("statement_id")}
				</span>
			)
		},
	},
	/* {
		accessorKey: "origin",
		header: () => <div className="text-center">M3</div>,
		cell: ({ row }) => {
			return (
				<span className="text-[12px] text-muted-foreground">
					{row.getValue("origin")}
				</span>
			)
		},
	},
	{
		accessorKey: "origin",
		header: () => <div className="text-center">Volume</div>,
		cell: ({ row }) => {
			return (
				<span className="text-[12px] text-muted-foreground">
					{row.getValue("origin")}
				</span>
			)
		},
	},
	{
		accessorKey: "origin",
		header: () => <div className="text-center">À pagar</div>,
		cell: ({ row }) => {
			return (
				<span className="text-[12px] text-muted-foreground">
					{row.getValue("origin")}
				</span>
			)
		},
	}, */
	{
		accessorKey: "origin",
		header: () => <div className="text-center">Origem</div>,
		cell: ({ row }) => {
			return (
				<span className="text-[12px] text-muted-foreground">
					{row.getValue("origin")}
				</span>
			)
		},
	},
	{
		accessorKey: "destiny",
		header: () => <div className="text-center">Destino</div>,
		cell: ({ row }) => {
			return (
				<span className="text-[12px] text-muted-foreground">
					{row.getValue("destiny")}
				</span>
			)
		},
	},
	{
		accessorKey: "car_id",
		header: () => <div className="text-center">Veículo</div>,
		cell: ({ row }) => {
			return (
				<span className="text-[12px] text-muted-foreground">
					{row.getValue("car_id")}
				</span>
			)
		},
	},
	{
		accessorKey: "driver_id",
		header: () => <div className="text-center">Motorista</div>,
		cell: ({ row }) => {
			return (
				<span className="text-[12px] text-muted-foreground">
					{row.getValue("driver_id")}
				</span>
			)
		},
	},
	{
		accessorKey: "created_by",
		header: () => <div className="text-center">Criado por</div>,
		cell: ({ row }) => {
			return (
				<span className="text-[12px] text-muted-foreground">
					{row.getValue("created_by")}
				</span>
			)
		},
	},
	{
		accessorKey: "status",
		header: () => <div className="text-center">Status</div>,
		cell: ({ row }) => {
			const status = row.getValue("status") as string
			const statusColors: Record<string, string> = {
				pending: "bg-yellow-400",
				approved: "bg-green-500",
				rejected: "bg-red-500",
			}

			return (
				<span className="flex justify-center">
					<span
						className={`inline-block w-3 h-3 rounded-full ${statusColors[status] || "bg-blue-500"}`}
					/>
				</span>
			)
		},
	},
]

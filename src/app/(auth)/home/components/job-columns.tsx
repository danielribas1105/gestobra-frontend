"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Job } from "@/schemas/job"

export const JobColumns: ColumnDef<Job>[] = [
	{
		accessorKey: "created_at",
		header: "Data de Criação",
	},
	{
		accessorKey: "statement_id",
		header: "Manifesto",
	},
	{
		accessorKey: "origin",
		header: "Origem",
	},
	{
		accessorKey: "destiny",
		header: "Destino",
	},
	{
		accessorKey: "car_id",
		header: "Veículo",
	},
	{
		accessorKey: "driver_id",
		header: "Motorista",
	},
	{
		accessorKey: "created_by",
		header: "Criado por",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
]

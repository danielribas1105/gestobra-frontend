"use client"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useStatementByJob } from "@/hooks/statements/use-statements"
import { cn } from "@/lib/utils"
import { Payment } from "@/schemas/payment"
import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

interface PendingChange {
	status: Payment["status"]
	updated_at: Payment["updated_at"]
}

export function getPaymentColumns(
	onStatusChange: (paymentId: string, checked: boolean) => void,
	pendingChanges: Record<string, PendingChange>,
	onDelete: (paymentId: string) => void,
	isDeleting: boolean,
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
								"border-muted-foreground",
								hasPendingChange &&
									"border-yellow-500 data-[state=checked]:bg-yellow-500",
							)}
							onCheckedChange={(checked) =>
								onStatusChange(payment.id, !!checked)
							}
							onClick={(e) => e.stopPropagation()}
							disabled={payment.status === "paid"}
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
				const { data: statement } = useStatementByJob(jobId)
				return (
					<div className="text-[12px] text-center text-muted-foreground">
						{statement?.code}
					</div>
				)
			},
		},
		{
			accessorKey: "total",
			header: () => <div className="text-center">Valor</div>,
			cell: ({ row }) => {
				const value = row.getValue("total") as number
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
		{
			id: "actions",
			header: () => <div className="text-center">Ações</div>,
			cell: ({ row }) => {
				const payment = row.original
				const isPaid = payment.status === "paid"

				return (
					<div
						className="flex justify-center"
						onClick={(e) => e.stopPropagation()}
					>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
									disabled={isPaid || isDeleting}
									aria-label="Excluir pagamento"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</AlertDialogTrigger>

							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Você quer realmente excluir?
									</AlertDialogTitle>
									<AlertDialogDescription>
										Essa ação não pode ser desfeita. Isso irá excluir
										permanentemente o pagamento <strong>{payment.id}</strong>.
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel>Cancelar</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => onDelete(payment.id)}
										className="bg-red-600 hover:bg-red-700"
									>
										Sim, excluir
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)
			},
		},
	]
}

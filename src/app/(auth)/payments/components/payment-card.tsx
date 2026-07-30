"use client"

import { Checkbox } from "@/components/ui/checkbox"
import LabelCard from "@/components/ui/label-card"
import MobileCardShell from "@/components/ui/mobile-card-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { useStatementByJob } from "@/hooks/statements/use-statements"
import { cn } from "@/lib/utils"
import { Payment } from "@/schemas/payment"

interface PendingChange {
	status: Payment["status"]
	updated_at: Payment["updated_at"]
}

export interface PaymentCardProps {
	payment: Payment
	onStatusChange: (paymentId: string, checked: boolean) => void
	pendingChanges: Record<string, PendingChange>
}

export default function PaymentCard({
	payment,
	onStatusChange,
	pendingChanges,
}: PaymentCardProps) {
	const { data: statement, isLoading } = useStatementByJob(payment.job_id)

	const isPaid = payment.status === "paid"
	const hasPendingChange = pendingChanges[payment.id] !== undefined // ✅ mesma lógica da coluna "select"

	const createdDate = new Date(payment.created_at ?? "")
	const updatedRaw = payment.updated_at
	const updatedDate = updatedRaw
		? updatedRaw instanceof Date
			? updatedRaw
			: new Date(updatedRaw)
		: null

	return (
		<MobileCardShell
			className="w-full p-3 gap-3"
			disabled={isPaid}
			ariaLabel={`Pagamento referente ao MTR ${statement?.code ?? payment.job_id}`}
			header={
				<header className="flex items-start justify-between">
					<div className="flex flex-col">
						<h2 className="text-sm text-secondary-foreground font-semibold">
							MTR nº
						</h2>
						{isLoading ? (
							<Skeleton className="h-5 w-16 mt-1" />
						) : (
							<p className="text-lg text-muted-foreground font-semibold">
								{statement?.code}
							</p>
						)}
					</div>

					{/* ✅ checkbox "Pago" - mesma função da coluna select */}
					<div className="flex flex-col items-center gap-1">
						<span className="text-[11px] text-muted-foreground">Pago</span>
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
							disabled={isPaid}
						/>
					</div>
				</header>
			}
		>
			<div className="flex flex-col gap-2 text-secondary-foreground">
				<LabelCard
					description="Data da movimentação"
					label="Data"
					value={createdDate.toLocaleDateString("pt-BR")}
				/>

				<LabelCard
					description="Valor total da movimentação"
					label="Total"
					value={payment.total.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				/>

				{/* ✅ status com mesma formatação/cor da coluna status */}
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Status</span>
					<span
						className={cn(
							"text-[12px] font-medium",
							hasPendingChange && "italic text-yellow-600",
							!hasPendingChange && isPaid && "text-green-600",
							!hasPendingChange && !isPaid && "text-muted-foreground",
						)}
					>
						{isPaid ? "Pago" : "À pagar"}
						{hasPendingChange && " *"}
					</span>
				</div>

				<LabelCard
					description="Data da realização do pagamento"
					label="Data Pagamento"
					value={updatedDate ? updatedDate.toLocaleDateString("pt-BR") : "—"}
				/>
			</div>
		</MobileCardShell>
	)
}

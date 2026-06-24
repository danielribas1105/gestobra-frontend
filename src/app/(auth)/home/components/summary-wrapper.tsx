import { usePaymentsSum } from "@/hooks/payments/use-payments"
import SummaryCard from "./summary-card"
import LabelCard from "@/components/ui/label-card"
import { formatCurrencyBR } from "@/utils/format-numbers"
import { useJobsCount } from "@/hooks/jobs/use-jobs"
import { useStatementsCount } from "@/hooks/statements/use-statements"

export default function SummaryWrapper() {
	const { data: statementsSum } = useStatementsCount()
	const { data: paymentsSum } = usePaymentsSum()
	const { data: jobsCount } = useJobsCount()

	return (
		<div className="flex flex-col md:flex-row gap-2 items-center justify-around">
			<SummaryCard title="MTRs">
				<LabelCard
					description={""}
					label={"Aprovado"}
					value={statementsSum?.approved}
				/>
				<LabelCard
					description={""}
					label={"Pendente"}
					value={statementsSum?.pending}
				/>
				<LabelCard
					description={""}
					label={"Rejeitado"}
					value={statementsSum?.rejected}
				/>
				<LabelCard
					description={""}
					label={"Concluído"}
					value={statementsSum?.concluded}
				/>
			</SummaryCard>
			<SummaryCard title="Movimentações">
				<div className="flex items-center gap-1.5">
					<span className={`size-3 rounded-full bg-green-500`} />
					<LabelCard
						description={""}
						label={"Concluída"}
						value={jobsCount?.completed}
					/>
				</div>
				<div className="flex items-center gap-1.5">
					<span className={`size-3 rounded-full bg-blue-500`} />
					<LabelCard
						description={""}
						label={"Em andamento"}
						value={jobsCount?.in_progress}
					/>
				</div>
				<div className="flex items-center gap-1.5">
					<span className={`size-3 rounded-full bg-yellow-400`} />
					<LabelCard
						description={""}
						label={"Pendente"}
						value={jobsCount?.pending}
					/>
				</div>
				<div className="flex items-center gap-1.5">
					<span className={`size-3 rounded-full bg-red-500`} />
					<LabelCard
						description={""}
						label={"Cancelada"}
						value={jobsCount?.canceled}
					/>
				</div>
			</SummaryCard>
			<SummaryCard title="Pagamentos">
				<LabelCard
					description={""}
					label={"Pago"}
					value={formatCurrencyBR(paymentsSum?.paid ?? 0)}
				/>
				<LabelCard
					description={""}
					label={"Pendente"}
					value={formatCurrencyBR(paymentsSum?.pending ?? 0)}
				/>
				<LabelCard
					description={""}
					label={"Cancelado"}
					value={formatCurrencyBR(paymentsSum?.canceled ?? 0)}
				/>
			</SummaryCard>
		</div>
	)
}

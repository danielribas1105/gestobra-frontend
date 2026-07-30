import { usePaymentsSum } from "@/hooks/payments/use-payments"
import SummaryCard from "./summary-card"
import LabelCard from "@/components/ui/label-card"
import { formatCurrencyBR } from "@/utils/format-numbers"
import { useJobsCount } from "@/hooks/jobs/use-jobs"
import { useStatementsCount } from "@/hooks/statements/use-statements"
import PieChartComponent from "@/components/graphics/pie-chart"
import { ToChartData } from "@/utils/charts-data-format"
import {
	COLORS_STATUS_MAP,
	PAYMENTS_STATUS_MAP,
} from "@/constants/ColorsStatus"

export default function SummaryWrapper() {
	const { data: statementsSum } = useStatementsCount()
	const { data: paymentsSum } = usePaymentsSum()
	const { data: jobsCount } = useJobsCount()

	const statementsChartData = statementsSum
		? ToChartData(statementsSum, COLORS_STATUS_MAP)
		: []
	const paymentsChartData = paymentsSum
		? ToChartData(paymentsSum, PAYMENTS_STATUS_MAP)
		: []
	const jobsChartData = jobsCount
		? ToChartData(jobsCount, COLORS_STATUS_MAP)
		: []

	return (
		<div className="flex flex-col md:flex-row gap-2 items-center justify-around">
			<SummaryCard title="MTRs">
				<div className="flex-1 flex-col">
					<div className="flex items-center gap-1.5">
						<span className={`size-3 rounded-full bg-green-500`} />
						<LabelCard
							description={""}
							label={"Concluído"}
							value={statementsSum?.concluded}
						/>
					</div>
					<div className="flex items-center gap-1.5">
						<span className={`size-3 rounded-full bg-blue-500`} />
						<LabelCard
							description={""}
							label={"Em andamento"}
							value={statementsSum?.in_progress}
						/>
					</div>
					<div className="flex items-center gap-1.5">
						<span className={`size-3 rounded-full bg-yellow-400`} />
						<LabelCard
							description={""}
							label={"Pendente"}
							value={statementsSum?.pending}
						/>
					</div>
					<div className="flex items-center gap-1.5">
						<span className={`size-3 rounded-full bg-red-500`} />
						<LabelCard
							description={""}
							label={"Cancelado"}
							value={statementsSum?.canceled}
						/>
					</div>
				</div>
				<div className="flex-1 items-center justify-center">
					<div className="w-full h-28">
						<PieChartComponent data={statementsChartData} />
					</div>
				</div>
			</SummaryCard>
			<SummaryCard title="Movimentações">
				<div className="flex-1 flex-col">
					<div className="flex items-center gap-1.5">
						<span className={`size-3 rounded-full bg-green-500`} />
						<LabelCard
							description={""}
							label={"Concluída"}
							value={jobsCount?.concluded}
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
				</div>
				<div className="flex-1 items-center justify-center">
					<div className="w-full h-28">
						<PieChartComponent data={jobsChartData} />
					</div>
				</div>
			</SummaryCard>
			<SummaryCard title="Pagamentos">
				<div className="flex-1 flex-col">
					<div className="flex items-center gap-1.5">
						<span className={`size-3 rounded-full bg-green-500`} />
						<LabelCard
							description={""}
							label={"Pago"}
							value={formatCurrencyBR(paymentsSum?.paid ?? 0)}
						/>
					</div>
					<div className="flex items-center gap-1.5">
						<span className={`size-3 rounded-full bg-yellow-400`} />
						<LabelCard
							description={""}
							label={"À pagar"}
							value={formatCurrencyBR(paymentsSum?.pending ?? 0)}
						/>
					</div>
					<div className="flex items-center gap-1.5">
						<span className={`size-3 rounded-full bg-red-500`} />
						<LabelCard
							description={""}
							label={"Cancelado"}
							value={formatCurrencyBR(paymentsSum?.canceled ?? 0)}
						/>
					</div>
				</div>
				<div className="flex-1 items-center justify-center">
					<div className="w-full h-28">
						<PieChartComponent data={paymentsChartData} />
					</div>
				</div>
			</SummaryCard>
		</div>
	)
}

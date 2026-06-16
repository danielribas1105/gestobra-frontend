"use client"

import TitlePage from "@/components/layout/title-page"
import ListPayments from "./components/list-payments"

export default function PaymentsPage() {
	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Pagamentos por Placa"
				placeholder="Procure pela placa - Ex: oxk8978"
			/>
			<div className="flex justify-center">
				<ListPayments />
			</div>
		</section>
	)
}

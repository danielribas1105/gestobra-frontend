"use client"

import TitlePage from "@/components/layout/title-page"
import { DataTable } from "@/components/ui/data-table"
import { usePaymentsSummaryByCar } from "@/hooks/payments/use-payments"
import { PaymentByCar } from "@/schemas/payment"
import { useState } from "react"
import ListPaymentsCar from "./components/list-payments-car"
import PaymentsCarWrapper from "./components/payments-car-wrapper"
import { PaymentColumnsByCar } from "./components/payments-columns-by-car"

export default function PaymentsPage() {
	const [selectedPaymentCar, setSelectedPaymentCar] = useState<
		PaymentByCar | undefined
	>(undefined)
	const { data: summaryByCar, isLoading } = usePaymentsSummaryByCar()

	if (isLoading) return <p>Carregando...</p>

	return (
		<section className="flex flex-col gap-7">
			<TitlePage title="Pagamentos" />
			{/* Desktop: payment by car table */}
			<DataTable
				columns={PaymentColumnsByCar}
				data={summaryByCar ?? []}
				onRowClick={(payment) => setSelectedPaymentCar(payment)}
			/>
			{/* Mobile: cards payment by car */}
			<ListPaymentsCar
				paymentsCar={summaryByCar ?? []}
				onPaymentCarClick={(payment) => setSelectedPaymentCar(payment)}
			/>

			<PaymentsCarWrapper
				open={!!selectedPaymentCar}
				onOpenChange={(p) => {
					if (!p) setSelectedPaymentCar(undefined)
				}}
				paymentByCar={selectedPaymentCar}
			/>
		</section>
	)
}

"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Payment, PaymentByCar } from "@/schemas/payment"
import { useQuery } from "@tanstack/react-query"

export function usePayments() {
	return useQuery<Payment[]>({
		queryKey: ["payments"],
		queryFn: () => clientApi(routes.payments.list),
	})
}

export function usePaymentsSummaryByCar() {
	return useQuery<PaymentByCar[]>({
		queryKey: ["payments", "summary", "by-car"],
		queryFn: () => clientApi(routes.payments.summaryByCar),
	})
}

export function usePaymentsByLicense(license: string) {
	return useQuery<Payment[]>({
		queryKey: ["payments", "license", license],
		queryFn: () => clientApi(routes.payments.getByLicense(license)),
		enabled: !!license,
	})
}

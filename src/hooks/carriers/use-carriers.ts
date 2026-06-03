"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Carrier } from "@/schemas/carrier"
import { useQuery } from "@tanstack/react-query"

export function useCarriers() {
	return useQuery<Carrier[]>({
		queryKey: ["carriers"],
		queryFn: () => clientApi(routes.carriers.list),
	})
}

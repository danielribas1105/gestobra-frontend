"use client"

import { routes } from "@/config/routes"
import { clientApi } from "@/lib/api/client"
import { Material } from "@/schemas/material"
import { useQuery } from "@tanstack/react-query"

export function useMaterials() {
	return useQuery<Material[]>({
		queryKey: ["materials"],
		queryFn: () => clientApi(routes.materials.list),
	})
}

export function useMaterial(id: string) {
	return useQuery<Material>({
		queryKey: ["materials", id],
		queryFn: () => clientApi(routes.materials.getById(id)),
		enabled: !!id,
	})
}

import { Fragment, ReactNode } from "react"

export interface MobileListProps<T> {
	items: T[]
	getKey: (item: T) => string
	renderItem: (item: T) => ReactNode
	emptyTitle?: string
	emptyDescription?: string
	emptyIcon?: string
}

/**
 * Lista genérica para a versão mobile (cards) de telas que também
 * possuem uma DataTable no desktop. Cuida do empty state e do
 * wrapper `md:hidden`; o item em si é fornecido via `renderItem`.
 */
export default function MobileList<T>({
	items,
	getKey,
	renderItem,
	emptyTitle = "Nenhum item encontrado",
	emptyDescription = "Os itens cadastrados aparecerão aqui",
	emptyIcon = "📋",
}: MobileListProps<T>) {
	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-8 text-center gap-2">
				<span className="text-2xl">{emptyIcon}</span>
				<p className="text-sm font-medium text-foreground">{emptyTitle}</p>
				<p className="text-xs text-muted-foreground">{emptyDescription}</p>
			</div>
		)
	}

	return (
		<div className="md:hidden flex flex-col gap-3">
			{items.map((item) => (
				<Fragment key={getKey(item)}>{renderItem(item)}</Fragment>
			))}
		</div>
	)
}

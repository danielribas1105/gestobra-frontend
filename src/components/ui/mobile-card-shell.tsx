"use client"

import { cn } from "@/lib/utils"
import { KeyboardEvent, ReactNode } from "react"

export interface MobileCardShellProps {
	/** Conteúdo do cabeçalho do card (título, identificador etc.) */
	header?: ReactNode
	/** Conteúdo principal do card */
	children: ReactNode
	/** Se definido, o card fica clicável/navegável por teclado (Enter/Espaço) */
	onClick?: () => void
	/** Estado "desabilitado": remove clique/foco e aplica opacidade reduzida */
	disabled?: boolean
	/** Rótulo de acessibilidade obrigatório (screen readers) */
	ariaLabel: string
	/** Classes de layout específicas do consumidor (largura, altura, padding, gap) */
	className?: string
}

/**
 * Estrutura visual comum aos cards mobile (border, radius, flex-col),
 * com suporte a navegação por teclado quando `onClick` é fornecido.
 * Consumidores controlam dimensões/spacing via `className`.
 */
export default function MobileCardShell({
	header,
	children,
	onClick,
	disabled = false,
	ariaLabel,
	className,
}: MobileCardShellProps) {
	const clickable = !!onClick && !disabled

	function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
		if (!clickable) return
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault()
			onClick?.()
		}
	}

	return (
		<article
			className={cn(
				"border-2 rounded-lg flex flex-col",
				disabled && "opacity-60",
				clickable && "cursor-pointer",
				className,
			)}
			onClick={clickable ? onClick : undefined}
			onKeyDown={clickable ? handleKeyDown : undefined}
			role={clickable ? "button" : undefined}
			tabIndex={clickable ? 0 : undefined}
			aria-label={ariaLabel}
			aria-disabled={disabled || undefined}
		>
			{header}
			{children}
		</article>
	)
}

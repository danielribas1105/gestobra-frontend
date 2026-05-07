"use client"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { ReactNode } from "react"

interface ModalWrapperProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	title: string
	description?: string
	width?: string
	height?: string
	children: ReactNode
}

export default function ModalWrapper({
	open,
	onOpenChange,
	title,
	description,
	width,
	height,
	children,
}: ModalWrapperProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent style={{ width, maxWidth: "92vw", height }}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	)
}

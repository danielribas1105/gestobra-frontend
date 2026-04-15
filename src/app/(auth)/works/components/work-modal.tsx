"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Work } from "@/schemas/work"
import WorkForm from "./work-form"

interface WorkModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	work?: Work
}

export default function WorkModal({
	open,
	onOpenChange,
	work,
}: WorkModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			title={work ? "Editar obra" : "Adicionar obra"}
			description={
				work
					? "Edite as informações da obra e clique em salvar"
					: "Preencha as informações da nova obra e clique em salvar"
			}
		>
			<WorkForm work={work} onSuccess={() => onOpenChange(false)} />
		</ModalWrapper>
	)
}

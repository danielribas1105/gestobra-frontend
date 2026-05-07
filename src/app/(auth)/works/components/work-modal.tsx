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
			width="80vw"
			height="90vh"
			title={work ? "Excluir/Editar obra" : "Adicionar obra"}
			description={
				work
					? "Exclua ou edite as informações da obra"
					: "Preencha as informações da obra e clique em salvar"
			}
		>
			<WorkForm
				work={work}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}

"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Material } from "@/schemas/material"
import MaterialForm from "./material-form"

interface MaterialModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	material?: Material
}

export default function MaterialModal({
	open,
	onOpenChange,
	material,
}: MaterialModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			width="40vw"
			maxHeight="60vh"
			title={
				material
					? "Excluir/Editar material/resíduo"
					: "Adicionar material/resíduo"
			}
			description={
				material
					? "Exclua ou edite as informações do material/resíduo"
					: "Preencha as informações do novo material/resíduo e clique em salvar"
			}
		>
			<MaterialForm
				material={material}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}

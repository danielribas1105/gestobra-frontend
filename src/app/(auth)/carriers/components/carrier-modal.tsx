"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Carrier } from "@/schemas/carrier"
import CarrierForm from "./carrier-form"

interface CarrierModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	carrier?: Carrier
}

export default function CarrierModal({
	open,
	onOpenChange,
	carrier,
}: CarrierModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			title={carrier ? "Editar transportadora" : "Adicionar transportadora"}
			description={
				carrier
					? "Edite as informações da transportadora e clique em salvar"
					: "Preencha as informações da nova transportadora e clique em salvar"
			}
		>
			<CarrierForm
				carrier={carrier}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}

"use client"

import ModalWrapper from "@/components/layout/modal-wrapper"
import { Job } from "@/schemas/job"
import { Work } from "@/schemas/work"
import JobForm from "./job-form"

interface JobModalProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	job?: Job
	lockedOriginWork?: Work
	onJobCreated?: (job: Job) => void
}

export default function JobModal({
	open,
	onOpenChange,
	job,
	lockedOriginWork,
	onJobCreated,
}: JobModalProps) {
	return (
		<ModalWrapper
			open={open}
			onOpenChange={onOpenChange}
			width="70vw"
			maxHeight="90vh"
			title={job ? "Excluir/Editar transporte" : "Adicionar transporte"}
			description={
				job
					? "Exclua ou edite as informações do transporte"
					: "Preencha as informações do novo transporte e clique em salvar"
			}
		>
			<JobForm
				job={job}
				lockedOriginWork={lockedOriginWork}
				onJobCreated={onJobCreated}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ModalWrapper>
	)
}

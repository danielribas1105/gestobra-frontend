import { Carrier } from "@/schemas/carrier"
import { formatDate } from "@/utils/format-date"
import { MapPinHouse } from "lucide-react"
import { useState } from "react"
import CarrierModal from "./carrier-modal"
import LabelCard from "@/components/ui/label-card"

export interface CarrierCardProps {
	carrier: Carrier
}

export default function CarrierCard({ carrier }: CarrierCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-64 border-2 rounded-lg p-4 flex flex-col gap-2 justify-between cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes da obra ${carrier.name}`}
			>
				<div className="flex flex-col gap-2 text-secondary-foreground">
					<header className="flex items-center justify-between">
						<div className="flex gap-2 items-center">
							<h2 className="text-2xl font-semibold">{carrier.name}</h2>
						</div>
					</header>
					<div className="flex flex-col gap-2">
						<LabelCard
							description="Manifesto de transporte de resíduos e rejeitos"
							label="Razão Social"
							value={carrier.code}
						/>
						<LabelCard
							description="Endereço da empresa transportadora"
							label="Endereço"
							value={carrier.address ?? ""}
						/>
					</div>
				</div>
				<footer className="flex items-center gap-1 text-secondary-foreground">
					<LabelCard
						description="Data de cadastro da transportadora"
						label="Data de Cadastro"
						value={formatDate(carrier.created_at ?? "")}
					/>
				</footer>
			</article>
			<CarrierModal open={open} onOpenChange={setOpen} carrier={carrier} />
		</>
	)
}

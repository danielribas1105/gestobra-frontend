import { Carrier } from "@/schemas/carrier"
import { formatDate } from "@/utils/format-date"
import { MapPinHouse } from "lucide-react"
import { useState } from "react"
import CarrierModal from "./carrier-modal"

export interface CarrierCardProps {
	carrier: Carrier
}

export default function CarrierCard({ carrier }: CarrierCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-64 border-2 rounded-lg p-4 flex flex-col gap-2 justify-between cursor-pointer"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes da obra ${carrier.name}`}
			>
				<div className="flex flex-col gap-2 text-secondary-foreground">
					<header className="flex items-center justify-between">
						<div className="flex gap-2 items-center">
							<MapPinHouse className="text-muted-foreground" size={30} />
							<h2 className="text-2xl font-semibold">{carrier.name}</h2>
						</div>
					</header>
					<div className="flex flex-col gap-2">
						<dl>
							<dt className="sr-only">
								Manifesto de transporte de resíduos e rejeitos
							</dt>
							<dd className="flex gap-2 items-center">
								<p className="font-semibold text-muted-foreground">MTR nº:</p>
								<p className="font-semibold">{carrier.code}</p>
							</dd>
						</dl>
						<dl>
							<dt className="sr-only">Endereço da obra</dt>
							<dd className="flex gap-2 items-center">
								<p className="font-semibold text-muted-foreground">Endereço:</p>
								<p className="font-semibold">{carrier.address}</p>
							</dd>
						</dl>
					</div>
				</div>
				<footer className="flex items-center gap-1 text-secondary-foreground">
					<p className="font-semibold text-muted-foreground">Criada em:</p>
					<p>{formatDate(carrier.created_at ?? "")}</p>
				</footer>
			</article>
			<CarrierModal open={open} onOpenChange={setOpen} carrier={carrier} />
		</>
	)
}

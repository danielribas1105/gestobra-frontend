// app/test/page.tsx
import Image from "next/image"

export default function TestPage() {
	return (
		<Image
			src="/cars/caminhao-basculante-cacamba.jpg"
			alt="test"
			width={300}
			height={200}
		/>
	)
}

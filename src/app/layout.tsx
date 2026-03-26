import "./globals.css"

import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
	title: "Auth Model Front",
	description: "Authentication model — Next.js + FastAPI",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="pt-BR" className={cn("font-sans", geist.variable)}>
			<TooltipProvider>
				<body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
			</TooltipProvider>
		</html>
	)
}

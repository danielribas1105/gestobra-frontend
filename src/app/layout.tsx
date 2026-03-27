import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
	title: "GestObra",
	description: "Web Application",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="pt-BR" className={cn("font-sans", inter.variable)}>
			<body className="bg-gray-50 text-gray-900 antialiased">
				<TooltipProvider>{children}</TooltipProvider>
			</body>
		</html>
	)
}

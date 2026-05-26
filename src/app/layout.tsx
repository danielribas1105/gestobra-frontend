import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import QueryProvider from "@/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/theme-provider"
import { ThemeScript } from "@/components/theme-script"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
	title: "GestObra",
	description: "Gestão de resíduos de obra",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="pt-BR" className={cn("font-sans", inter.variable)}>
			<ThemeScript /> {/* Qual a função?! */}
			<body className="bg-background text-foreground antialiased">
				<QueryProvider>
					<ThemeProvider>
						<TooltipProvider>{children}</TooltipProvider>
					</ThemeProvider>
					<Toaster />
				</QueryProvider>
			</body>
		</html>
	)
}

import { AppSidebar } from "@/components/ui/app-sidebar"
import PageLayout from "@/components/layout/page-layout"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header>
					<SidebarTrigger />
					<PageLayout>{children}</PageLayout>
				</header>
			</SidebarInset>
		</SidebarProvider>
	)
}

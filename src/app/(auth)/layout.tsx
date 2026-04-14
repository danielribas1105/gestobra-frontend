import { AppSidebar } from "@/components/ui/app-sidebar"
import PageLayout from "@/components/layout/page-layout"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarTrigger />
			<PageLayout>{children}</PageLayout>
		</SidebarProvider>
	)
}

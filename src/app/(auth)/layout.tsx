import { HeaderBtns } from "@/components/header-btns"
import PageLayout from "@/components/layout/page-layout"
import { AppSidebar } from "@/components/ui/app-sidebar"
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
				<header className="flex justify-between items-center py-2 px-4">
					<SidebarTrigger color="#51a41e" />
					<HeaderBtns />
				</header>
				<PageLayout>{children}</PageLayout>
			</SidebarInset>
		</SidebarProvider>
	)
}

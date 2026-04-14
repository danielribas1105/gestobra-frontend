import React from "react"

interface PageLayoutProps {
	className?: string
	children: React.ReactNode
}

export default function PageLayout({ className, children }: PageLayoutProps) {
	return <main className={`${className ?? ""} w-full pl-6 pr-16 py-4`}>{children}</main>
}

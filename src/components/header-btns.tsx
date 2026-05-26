"use client"
import { useTheme } from "@/providers/theme-provider"
import AddJobButton from "./add-job-btn"
import AddWorkButton from "./add-work-btn"
import LogoutButton from "./logout-button"
import OpenMapsButton from "./maps/btn-open-maps"
import { TooltipButton } from "./tooltip-button"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function HeaderBtns() {
	const { theme, toggleTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	// Verificar useEffect?!
	useEffect(() => {
		const timer = setTimeout(() => setMounted(true), 0)
		return () => clearTimeout(timer)
	}, [])

	return (
		<div className="flex items-center gap-2">
			<OpenMapsButton />
			<AddWorkButton />
			<AddJobButton />
			<TooltipButton
				label={mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}
				icon={mounted && theme === "dark" ? Sun : Moon}
				onClick={toggleTheme}
				iconClassName={
					mounted && theme === "dark" ? "!text-yellow-500" : "!text-slate-500"
				}
				className="w-8 h-8 rounded-lg"
			/>
			<LogoutButton />
		</div>
	)
}

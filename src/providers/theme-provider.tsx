"use client"

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react"

type Theme = "light" | "dark"

type ThemeContextValue = {
	theme: Theme
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === "undefined") return "dark"

		const stored = localStorage.getItem("theme") as Theme | null
		if (stored === "light" || stored === "dark") return stored
		if (window.matchMedia("(prefers-color-scheme: light)").matches)
			return "light"
		return "dark"
	})

	useEffect(() => {
		const root = document.documentElement
		if (theme === "dark") {
			root.classList.add("dark")
		} else {
			root.classList.remove("dark")
		}
		localStorage.setItem("theme", theme)
	}, [theme])

	const toggleTheme = () =>
		setTheme((prev) => (prev === "dark" ? "light" : "dark"))

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
	return ctx
}

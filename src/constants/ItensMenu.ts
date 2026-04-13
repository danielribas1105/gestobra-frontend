import {
	ArrowLeftRight,
	Construction,
	FileText,
	Home,
	ListCheck,
	LogOut,
	Truck,
	UserCircle2,
} from "lucide-react"

// Menu web application
export const itemsMenu = [
	{
		title: "Home",
		url: "/home",
		icon: Home,
	},
	{
		title: "Transportes",
		url: "/jobs",
		icon: ArrowLeftRight,
	},
	{
		title: "Obras",
		url: "/works",
		icon: Construction,
	},
	{
		title: "Veículos",
		url: "/cars",
		icon: Truck,
	},
	{
		title: "Manifestos",
		url: "/statements",
		icon: ListCheck,
	},
	{
		title: "Usuários",
		url: "/users",
		icon: UserCircle2,
	},
	{
		title: "Relatórios",
		url: "/reports",
		icon: FileText,
	},
	{
		title: "Logout",
		url: "/",
		icon: LogOut,
	},
]

// Menu landing page
export const menuLanding = [
	{
		title: "HOME",
		url: "/",
	},
	{
		title: "SOBRE NÓS",
		url: "/sobre-nos",
	},
	{
		title: "CONTATO",
		url: "/contato",
	},
]

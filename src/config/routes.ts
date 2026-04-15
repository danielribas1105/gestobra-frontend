import { create } from "domain"

export const routes = {
	home: "/",
	login: "/login",
	user: {
		list: "/users",
		create: "/users",
		update: (id: string) => `/users/${id}`,
		delete: (id: string) => `/users/${id}`,
	},
}

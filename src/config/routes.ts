import { create } from "domain"

export const routes = {
	home: "/",
	login: "/login",
	users: {
		list: "/users",
		create: "/users",
		update: (id: string) => `/users/${id}`,
		delete: (id: string) => `/users/${id}`,
	},
	cars: {
		list: "/cars",
		create: "/cars",
		update: (id: string) => `/cars/${id}`,
		delete: (id: string) => `/cars/${id}`,
	},
	works: {
		list: "/works",
		create: "/works",
		update: (id: string) => `/works/${id}`,
		delete: (id: string) => `/works/${id}`,
	},
	jobs: {
		list: "/jobs",
		create: "/jobs",
		update: (id: string) => `/jobs/${id}`,
		delete: (id: string) => `/jobs/${id}`,
	},
}

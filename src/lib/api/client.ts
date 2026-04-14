import { cookies } from "next/headers"
import { refreshAccessToken } from "../auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiClient(path: string, options: RequestInit = {}) {
	const cookieStore = await cookies()
	let token = cookieStore.get("access_token")?.value

	const doFetch = async (accessToken?: string) => {
		return fetch(`${API_URL}${path}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Authorization: accessToken ? `Bearer ${accessToken}` : "",
				...options.headers,
			},
		})
	}

	let res = await doFetch(token)

	// 🔥 token expirou → tenta refresh
	if (res.status === 401) {
		token = await refreshAccessToken()

		if (!token) {
			throw new Error("Unauthorized")
		}

		res = await doFetch(token)
	}

	if (!res.ok) {
		throw new Error("Erro na API")
	}

	return res.json()
}

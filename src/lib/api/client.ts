const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function clientApiClient(path: string, options: RequestInit = {}) {
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		credentials: "include", // 🔥 ENVIA COOKIES
	})

	if (!res.ok) {
		throw new Error("Erro na API")
	}

	return res.json()
}

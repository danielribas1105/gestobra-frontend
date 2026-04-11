import { cookies } from "next/headers"

import { User } from "@/schemas/user"

import UserCard from "./user-card"

async function fetchUsers(): Promise<User[]> {
	const token = (await cookies()).get("auth_token")?.value

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	if (!res.ok) throw new Error("Erro ao buscar usuários")
	return res.json()
}

export default async function ListUsers() {
	const users = await fetchUsers()

	if (users.length === 0) {
		return <div>Nenhum usuário cadastrado!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{users &&
				users.map((user: User) => <UserCard key={user.id} user={user} />)}
		</div>
	)
}

import { User } from "@/schemas/user"
import { clientApiClient } from "@/lib/api/client"
import { useQuery } from "@tanstack/react-query"
import UserCard from "./user-card"

export default function ListUsers() {
	const { data: users = [], isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: () => clientApiClient("/users"),
	})

	if (isLoading) return <p>Carregando...</p>

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

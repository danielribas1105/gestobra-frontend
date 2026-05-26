import Image from "next/image"
import LoginForm from "./components/login-form"
import logo from "@/../public/logo/logo-gestobra-512x512.png"

export default function LoginPage() {
	return (
		<main className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md space-y-6">
				{/* Header */}
				<div className="text-center">
					<div className="mx-auto w-52 h-52 bg-transparent rounded-xl flex items-center justify-center mb-1">
						<Image src={logo} alt="Logo" />
					</div>
					<h1 className="text-3xl font-bold text-foreground">Bem-vindo</h1>
					<p className="mt-2 text-sm text-foreground">
						Entre com sua conta para continuar
					</p>
				</div>

				{/* Form Card */}
				<div className="bg-background text-foreground rounded-2xl shadow-sm border border-border px-8 py-4">
					<LoginForm />
				</div>
			</div>
		</main>
	)
}

"use client"

import { useEffect, useRef } from "react"

type Position = {
	vehicle_id: string
	lat: number
	lng: number
}

export function useFleetSocket(onMessage: (data: Position) => void) {
	const wsRef = useRef<WebSocket | null>(null)

	useEffect(() => {
		const token = document.cookie
			.split("; ")
			.find((c) => c.startsWith("access_token="))
			?.split("=")[1]

		if (!token) return

		const ws = new WebSocket(`ws://localhost:8000/ws/fleet?token=${token}`)

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data)
			onMessage(data)
		}

		ws.onclose = () => {
			console.log("WebSocket fechado")
		}

		wsRef.current = ws

		return () => {
			ws.close()
		}
	}, [onMessage])
}

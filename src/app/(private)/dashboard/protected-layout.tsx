"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter()
    const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token) {
            setAuthenticated(false)
            router.replace("/")
            toast.error("Sesión expirada")
        } else {
            setAuthenticated(true)
        }
    }, [router])

    if(!isAuthenticated || isAuthenticated === null) {
        return <div className="h-screen bg-red-500">Cargando...</div>
    }

    return <>{children}</>
}
"use client";

import { Button } from "@heroui/react";
import ProtectedLayout from "./protected-layout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "./globals.css";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const router = useRouter(); // Inicializa el router

    const handleAddOperationClick = () => {
        const token = localStorage.getItem("token"); // Verificar si existe el token
        if (!token) {
            // Si no hay token, redirigir a la página principal
            router.replace("/"); // Redirige al home
            toast.error("Sesión expirada")
        } else {
            // Si hay token, permitir navegación
            router.push("/dashboard/add"); // Navegar a la página de añadir operación
        }
    };
    return (
        <>
            <ProtectedLayout>
                <header className="border-b border-blue-100 bg-pink-50">
                    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Gestión de operaciones 
                        </h1>

                        <p className="mt-1.5 text-sm text-gray-500">
                            Web para controlar tus transacciones.
                        </p>
                        </div>

                        <div className="flex items-center gap-4">
                        <Button
                            onPress={handleAddOperationClick}
                            variant="solid"
                            className="bg-blue-300"
                        >
                            Añadir operación
                        </Button>
                        </div>
                    </div>
                    </div>
                </header>
                {children}
            </ProtectedLayout>
        </>
    );
}
import { AuthSchema } from "../schemas/auth.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; 

export async function registerService(credentials: AuthSchema) {
    console.log("API_URL:", API_URL); 

    if (!API_URL) {
        throw new Error("La variable NEXT_PUBLIC_API_URL no está definida");
    }

    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        let errorMessage = "Error al registrar usuario";
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (error) {
            console.error("Error al parsear la respuesta de error:", error);
        }
        throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.token) {
        throw new Error("No se recibió un token");
    }

    return data;
}

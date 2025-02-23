import { AuthSchema } from "../schemas/auth.schema";

export async function loginService(credentials: AuthSchema) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        }
    );

    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar usuario")
    }

    const data = await response.json()

    if (!data.token) {
        throw new Error("No se recibió un token")
    }

    return data;
}
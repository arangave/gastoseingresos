import { z } from "zod";

export const authSchema = z.object({
    email: z
        .string()
        .email("El correo electrónico no es válido")
        .min(1, "El correo electrónico es requerido"),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .max(50, "La contraseña no puede tener más de 50 caracteres")
})

export type AuthSchema = z.infer<typeof authSchema>
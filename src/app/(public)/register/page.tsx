"use client";

import { authSchema, AuthSchema } from "@/shared/schemas/auth.schema";
import { registerService } from "@/shared/services/register.service";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (dataForm: AuthSchema) => {
    try {
      const responseData = await registerService(dataForm);

      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        router.push("/dashboard");
      } else {
        throw new Error("No se recibió un token");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error al registrar tu usuario");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg p-8 rounded-lg bg-gray-900 shadow-[0_0_20px_rgba(0,255,0,0.5)] hover:shadow-[0_0_30px_rgba(0,255,0,0.7)] transition-shadow duration-300">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl text-white">
            Regístrate con nosotros
          </h1>
          <h2 className="mt-6 text-xl font-bold text-green-700">Crea tu cuenta</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            variant="bordered"
            {...register("email")}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            className="text-white autofill:bg-transparent autofill:text-white border-green-400 focus:border-green-500"
            
          />
          <Input
            label="Contraseña"
            type="password"
            variant="bordered"
            {...register("password")}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            className="text-white autofill:bg-transparent autofill:text-white border-green-400 focus:border-green-500"
            
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              ¿Ya tienes tu cuenta?{" "}
              <Link className="underline text-green-400 hover:text-green-300" href="/">
                Iniciar sesión
              </Link>
            </p>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
            >
              Registrarme
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { authSchema, AuthSchema } from "@/shared/schemas/auth.schema";
import { loginService } from "@/shared/services/login.service";
import { Button, Input, Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Login() {
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
      const responseData = await loginService(dataForm);

      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        router.push("/dashboard");
      } else {
        throw new Error("No se recibió un token");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 rounded-lg bg-gray-900 shadow-[0_0_20px_rgba(0,255,0,0.5)] hover:shadow-[0_0_30px_rgba(0,255,0,0.7)] transition-shadow duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Gestión de ingresos y gastos
          </h1>
          <h2 className="font-bold text-xl mt-6 text-green-700">Iniciar sesión</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            variant="bordered"
            className="text-white autofill:bg-transparent autofill:text-white"
            {...register("email")}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
          />
          <Input
            label="Contraseña"
            type="password"
            variant="bordered"
            className="text-white autofill:bg-transparent autofill:text-white"
            {...register("password")}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              ¿No tienes cuenta?{" "}
              <Link className="underline text-green-600 hover:text-green-500" href="/register">
                Regístrate
              </Link>
            </p>

            <Button className="bg-green-700 text-white hover:bg-green-800" type="submit" isLoading={isSubmitting}>
              Iniciar sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

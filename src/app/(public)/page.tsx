"use client"

import { authSchema, AuthSchema } from "@/shared/schemas/auth.schema";
import { loginService } from "@/shared/services/login.service";
import { Button, Input, Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Login() {

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema)
  })

  const onSubmit = async (dataForm: AuthSchema) => {

    try {
      const responseData = await loginService(dataForm);

      if (responseData.token){
        localStorage.setItem("token", responseData.token);
        router.push("/dashboard")
      } else {
        throw new Error("No se recibió un token")
      }
    } catch (error) {
      console.log(error)

      alert(error)
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mx-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Gestión de ingresos y gastos
        </h1>
        <h2 className="font-bold text-xl mt-6">Iniciar sesión</h2>
      </div>

      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mb-0 mt-8 max-w-md space-y-4"
      >
      <Input 
        label="Email" 
        type="email"
        variant="bordered" 
        {...register("email")}
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
      />
        <Input
          label="Contraseña" 
          type="password" 
          variant="bordered" 
          {...register("password")}
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta?
            <Link className="underline text-pink-300" href="/register">
              Regístrate
            </Link>
          </p>

          <Button className="bg-pink-300" type="submit" isLoading={isSubmitting}>
            Iniciar sesión
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { authSchema, AuthSchema } from "@/shared/schemas/auth.schema";
import { registerService } from "@/shared/services/register.service";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
      // TODO: Manejar el error con un toast por ejemplo
      toast.error("Error registrando usuario")
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Registrate</h1>
        <h2 className="font-bold text-xl mt-6">Crea tu cuenta</h2>
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
            ¿Ya tienes cuenta?
            <Link className="underline" href="/">
              Iniciar sesión
            </Link>
          </p>

          <Button color="secondary" type="submit" isLoading={isSubmitting}>
            Registrarse
          </Button>
        </div>
      </form>
    </div>
  );
}
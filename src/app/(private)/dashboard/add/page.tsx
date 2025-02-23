"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { expenseSchema, ExpenseSchema } from "@/shared/schemas/expense.schema";
import { createExpenseService } from "@/shared/services/createExpenseService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Definir el esquema de validación con Zod


export default function AddExpenses() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0, // Inicializamos con 0
      type: undefined, // También puedes inicializar otros campos
      description: ""
    }
  });

  const onSubmit = async (dataExpense: ExpenseSchema) => {
    // Verificar si existe el token en localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // Si no hay token, redirigir a la página principal
      router.replace("/");
      toast.error("Sesión expirada");
      return;
    }

    try {
      const responseData = await createExpenseService(dataExpense);
      
      if (responseData) {
        console.log(responseData)
        reset();
        router.push("/dashboard");
        toast.success("Operación añadida correctamente");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar los datos");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Añadir operación</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              label="Cantidad (€)"
              placeholder="0.00"
              isInvalid={!!errors.amount}
              errorMessage={errors.amount?.message}
              value={field.value !== undefined ? String(field.value) : ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Tipo"
              placeholder="Tipo de operación"
              selectedKeys={field.value ? [field.value] : []}
              onChange={(e) => field.onChange(e.target.value)}
              isInvalid={!!errors.type}
              errorMessage={errors.type?.message}
            >
              <SelectItem key="expense" value="expense">
                Gasto
              </SelectItem>
              <SelectItem key="income" value="income">
                Ingreso
              </SelectItem>
            </Select>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              label="Descripción"
              placeholder="Describe la operación"
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
              {...field}
            />
          )}
        />

        <Button type="submit"  isLoading={isSubmitting} className="w-full bg-pink-300">
          Guardar datos
        </Button>
      </form>
    </div>
  );
}
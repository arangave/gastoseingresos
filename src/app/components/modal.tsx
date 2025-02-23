"use client";

import { Modal, ModalContent, ModalBody, ModalHeader, Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { ModalComponentProps } from "@/shared/types/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseSchema, expenseSchema } from "@/shared/schemas/expense.schema";
import { Controller, useForm } from "react-hook-form";
import { editExpenseService } from "@/shared/services/editExpenseService";
import { deleteExpenseService } from "@/shared/services/deleteExpenseService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onClose, onConfirm, title, type, expense }) => {

    const router = useRouter();
    const expenseId = expense?.id;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ExpenseSchema>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            amount: expense?.amount || 0,
            type: expense?.type || "expense",
            description: expense?.description || "",
        }
    });

    const handleDelete = async () => {
        // Verificar si existe el token en localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            // Si no hay token, redirigir a la página principal
            router.replace("/");
            toast.error("Sesión expirada");
            return;
        }

        try {
            if (expenseId) {
                const result = await deleteExpenseService(expenseId); // Llamamos al servicio para eliminar el gasto
                console.log("Operación eliminada:", result);
                onConfirm(result);  // Llamamos a onConfirm con el resultado de la eliminación
                onClose();  // Cerramos el modal
                toast.success("Operación eliminada correctamente")
            }
        } catch (error) {
            console.error("Error al eliminar la operación:", error);
            toast.error("Error al eliminar la operación");
        }
    };

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
            if (type === "edit") {
                if (dataExpense && expenseId) {
                    const updatedExpense = { ...dataExpense };
                    console.log("Operación actualizada:", updatedExpense);

                    const result = await editExpenseService(updatedExpense, expenseId);
                    console.log("Resultado de la actualización:", result);
                    onConfirm(result);  // Llamamos a onConfirm con los datos actualizados
                    onClose();
                    toast.success("Operación actualizada correctamente")
                } else {
                    console.log("Error recibiendo los datos de la operación")
                }
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            toast.error("Error al guardar los datos");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="mx-auto items-center justify-center bg-black bg-opacity-100">
            <ModalContent className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 p-6">
                <ModalHeader className="text-xl font-semibold text-gray-800 mx-auto">{title}</ModalHeader>
                <ModalBody className="w-full mx-auto p-4">
                {type === "edit" ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <Input
                                type="number"
                                autoFocus
                                label="Cantidad (€)"
                                placeholder="0.00"
                                isInvalid={!!errors.amount}
                                errorMessage={errors.amount?.message}
                                value={(field.value !== undefined ? String(Math.round(field.value)) : "0")}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                onBlur={(e) => field.onChange(Number(e.target.value))}
                                />
                                /*
                                Como al Input hay que pasarle un valor que sea String, si no queremos modificar
                                el campo de amount se quedaría como String y daría error. Por eso añadimos el
                                autoFocus, para que el campo este automáticamente en focus y así con cualquier acción
                                que hagamos, ya sea modificar otro campo o clicar directamente al botón de Guardar cambios,
                                onBlur hace efecto para que no haga falta modificarlo. Sin esto, habría que introducir de nuevo
                                el monto de la operación aunque no quisieramos modificarlo.
                                */
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
                                    <SelectItem key="expense" >
                                    Gasto
                                    </SelectItem>
                                    <SelectItem key="income" >
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
                        <div className="flex justify-center space-x-4 pt-6">
                            <Button
                                onPress={onClose}
                                className="px-6 py-2 text-gray-600 border border-pink-200 rounded-lg bg-white hover:bg-pink-200"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                isLoading={isSubmitting}
                                className={`px-6 py-2 rounded-lg focus:outline-none bg-pink-300`}
                            >
                                Guardar cambios
                            </Button>
                        </div>
                    </form>
                    
                ) : (
                    <div className="mx-auto">
                        <p className="text-lg text-gray-600 mx-auto">¿Estás seguro de que deseas eliminar esta operación?</p>
                        <div className="flex justify-center space-x-4 pt-6">
                            <Button
                                variant="ghost"
                                onPress={onClose}
                                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg focus:outline-none hover:bg-gray-100"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="bordered"
                                color="danger"
                                onPress={handleDelete}
                                className={`px-6 py-2 rounded-lg focus:outline-none border border-red-600 text-red-600 hover:bg-red-600 hover:text-white`}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                )}
                </ModalBody>
                
            </ModalContent>
        </Modal>

    );
};

export default ModalComponent;

"use client";

import { Modal, ModalContent, ModalBody, ModalHeader, Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { ModalComponentProps } from "@/shared/types/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseSchema, expenseSchema } from "@/shared/schemas/expense.schema";
import { Controller, useForm } from "react-hook-form";
import { editExpenseService } from "@/shared/services/editExpenseService";
import { deleteExpenseService } from "@/shared/services/deleteExpenseService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/");
            toast.error("Sesión expirada");
            return;
        }

        try {
            if (expenseId) {
                const result = await deleteExpenseService(expenseId);
                onConfirm(result);
                onClose();
                toast.success("Operación eliminada correctamente");
            }
        } catch (error) {
            console.error("Error al eliminar la operación:", error);
            toast.error("Error al eliminar la operación");
        }
    };

    const onSubmit = async (dataExpense: ExpenseSchema) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/");
            toast.error("Sesión expirada");
            return;
        }

        try {
            if (type === "edit" && expenseId) {
                const updatedExpense = { ...dataExpense };
                const result = await editExpenseService(updatedExpense, expenseId);
                onConfirm(result);
                onClose();
                toast.success("Operación actualizada correctamente");
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            toast.error("Error al guardar los datos");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="flex items-center justify-center bg-black bg-opacity-90">
            <ModalContent className="bg-gray-900 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.5)] hover:shadow-[0_0_30px_rgba(0,255,0,0.7)] transition-shadow duration-300 w-full max-w-xl mx-4 p-6">
                <ModalHeader className="text-xl font-semibold text-white text-center">{title}</ModalHeader>
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
                                        value={field.value !== undefined ? String(Math.round(field.value)) : "0"}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        onBlur={(e) => field.onChange(Number(e.target.value))}
                                        className="border-green-500 focus:border-white focus:ring-2 focus:ring-white text-white"
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
                                        className="border-green-500 focus:border-white focus:ring-2 focus:ring-white text-white"
                                    >
                                        <SelectItem key="expense">Gasto</SelectItem>
                                        <SelectItem key="income">Ingreso</SelectItem>
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
                                        className="border-green-500 focus:border-white focus:ring-2 focus:ring-white text-white"
                                    />
                                )}
                            />

                            <div className="flex justify-center space-x-4 pt-6">
                                <Button
                                    onPress={onClose}
                                    className="px-6 py-2 text-white border border-green-500 rounded-lg hover:bg-green-500 hover:text-white"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    className="px-6 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white"
                                >
                                    Guardar cambios
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="mx-auto text-center">
                            <p className="text-lg text-gray-300">¿Estás seguro de que deseas eliminar esta operación?</p>
                            <div className="flex justify-center space-x-4 pt-6">
                                <Button
                                    variant="ghost"
                                    onPress={onClose}
                                    className="px-6 py-2 text-white border border-gray-500 rounded-lg hover:bg-gray-700"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="bordered"
                                    color="danger"
                                    onPress={handleDelete}
                                    className="px-6 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
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

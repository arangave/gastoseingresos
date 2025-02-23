"use client";

import ModalComponent from "@/app/components/modal";
import { ExpenseSchema } from "@/shared/schemas/expense.schema";
import { ExpenseBlockProps } from "@/shared/types/Expenses";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type ExpenseWithId = ExpenseSchema & { id: number };

const ExpenseBlock: React.FC<ExpenseBlockProps & { onUpdate: (updatedExpense: ExpenseWithId) => void, onDelete: (id: number) => void }> = ({
    id,
    amount,
    type,
    description,
    onUpdate,
    onDelete
}) => {

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"edit" | "delete">("edit");
    const [expenseData, setExpenseData] = useState({ amount, type, description });

    const handleEdit = () => {
        const token = localStorage.getItem("token"); // Verificar si existe el token
        if (!token) {
            // Si no hay token, redirigir a la página principal
            router.replace("/");
            toast.error("Sesión expirada")
        } else {
            // Si hay token, abrir el modal
            setModalType("edit");
            setIsModalOpen(true);
        }
    };

    const handleDelete = () => {
        const token = localStorage.getItem("token"); // Verificar si existe el token
        if (!token) {
            // Si no hay token, redirigir a la página principal
            router.replace("/");
            toast.error("Sesión expirada")
        } else {
            // Si hay token, abrir el modal
            setModalType("delete");
            setIsModalOpen(true);
        }
    };

    const handleConfirm = async (updatedExpense: ExpenseSchema) => {
        if (modalType === "edit") {
            try {
                console.log("Guardando cambios...");
                setExpenseData(updatedExpense);  // Actualizar los datos en el estado
                onUpdate({ id, ...updatedExpense} as ExpenseWithId)
            } catch (error) {
                console.error("Error al actualizar:", error);
            }
        } else if (modalType === "delete") {
            console.log("Eliminando expense...");
            onDelete(id);
        }
    };

    return (
        <>
        <article
        className={`flex items-center justify-between gap-4 rounded-lg border border-pink-100 bg-white p-6`}
        >
        <div className="flex items-center gap-4">
            <span
            className={`rounded-full p-3 ${
                expenseData.type === "income" ? "bg-green-100" : "bg-red-100"
            }`}
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-8 ${
                expenseData.type === "income" ? "text-green-600" : "text-red-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            </span>

            <div>
            <p
                className={`text-2xl font-medium ${
                expenseData.type === "income" ? "text-green-800" : "text-red-800"
                }`}
            >
                {expenseData.amount}€
            </p>
            <p className="text-sm text-gray-500">
                <b>{expenseData.type === "income" ? "Ingreso" : "Gasto"}:</b> {expenseData.description}
            </p>
            </div>
        </div>

        <div>
            <Dropdown>
            <DropdownTrigger>
                <Button className="border-pink-200 hover:bg-pink-200" variant="bordered">Opciones</Button>
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownItem key="edit" onPress={handleEdit}>
                    Editar
                </DropdownItem>
                <DropdownItem key="delete" className="text-danger" color="danger" onPress={handleDelete}>
                    Eliminar
                </DropdownItem>
            </DropdownMenu>
            </Dropdown>
        </div>
        </article>

        <ModalComponent
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirm}
            title={modalType === "edit" ? "Editar datos de la operación" : "Eliminar operación"}
            type={modalType}
            expense={{ id, ...expenseData }}
        />

        </>
    );
};

export default ExpenseBlock;
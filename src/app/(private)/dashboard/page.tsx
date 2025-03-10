"use client";

import ExpenseBlock from "@/app/components/expense-block";
import TotalCard from "@/app/components/card";
import { getExpensesService } from "@/shared/services/getExpenses.service";
import { ExpenseBlockProps } from "@/shared/types/Expenses";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [expenses, setExpenses] = useState<ExpenseBlockProps[]>([]);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                setLoading(true);
                const resultData = await getExpensesService();
                setExpenses(resultData);
            } catch (error) {
                console.error("Error al obtener los gastos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses(); 
    }, []); 

    const updateExpense = (updatedExpense: ExpenseBlockProps) => {
        setExpenses((prevExpenses) =>
            prevExpenses.map((expense) =>
                expense.id === updatedExpense.id ? updatedExpense : expense
            )
        );
    };

    const deleteExpense = (id: number) => {
        setExpenses((prevExpenses) =>
            prevExpenses.filter((expense) => expense.id !== id)
        );
    };

    return (
        <div className="max-w-screen-xl mx-auto px-6 ">
            <div className="flex flex-wrap gap-20 mt-8 rounded-lg border border-pink-100 bg-pink-50 p-6 max-w-fit">
                <TotalCard expenses={expenses} type="total" />
                <TotalCard expenses={expenses} type="income" />
                <TotalCard expenses={expenses} type="expense" />
            </div>

            {loading ? (
                <p className="text-center text-gray-600 py-8">Cargando gastos...</p>
            ) : (
                <div className="flex flex-col gap-4 py-8">
                    {expenses.map((expense) => (
                        <ExpenseBlock 
                            key={expense.id} 
                            {...expense}
                            onUpdate={updateExpense}
                            onDelete={deleteExpense}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
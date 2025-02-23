"use client";

import { ExpenseBlockProps } from "@/shared/types/Expenses";
import { useMemo } from "react";

interface TotalCardProps {
    expenses: ExpenseBlockProps[];
    type: "income" | "expense" | "total";
}

const TotalCard: React.FC<TotalCardProps> = ({ expenses, type }) => {
    const total = useMemo(() => {
        switch (type) {
            case "income":
                return expenses
                    .filter((expense) => expense.type === "income")
                    .reduce((acc, expense) => {
                        const amount = Number(expense.amount);
                        return isNaN(amount) ? acc : acc + amount;
                    }, 0);
            
            case "expense":
                return expenses
                    .filter((expense) => expense.type === "expense")
                    .reduce((acc, expense) => {
                        const amount = Number(expense.amount);
                        return isNaN(amount) ? acc : acc + amount;
                    }, 0);

            case "total":
                return expenses.reduce((acc, expense) => {
                    const amount = Number(expense.amount);
                    if (isNaN(amount)) {
                        return acc;
                    }
                    return expense.type === "income" ? acc + amount : acc - amount;
                }, 0);

            default:
                return 0;
        }
    }, [expenses, type]);

    const config = {
        income: {
            label: "Total Ingresos",
            color: "text-green-500",
            bg: "bg-green-900/20",
        },
        expense: {
            label: "Total Gastos",
            color: "text-red-500",
            bg: "bg-red-900/20",
        },
        total: {
            label: "Total ingresos menos gastos",
            color: "text-white",
            bg: "bg-gray-800",
        },
    };

    return (
        <article className={`p-4 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.5)] hover:shadow-[0_0_25px_rgba(0,255,0,0.7)] transition-shadow duration-300 ${config[type].bg}`}>
            <p className="text-sm text-gray-400">{config[type].label}</p>
            <p className={`text-2xl font-medium ${config[type].color}`}>
                {total.toFixed(2)}€
            </p>
        </article>
    );
};

export default TotalCard;

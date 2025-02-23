import { ExpenseSchema } from "../schemas/expense.schema";

export async function createExpenseService(expense: ExpenseSchema) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/expenses`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(expense),
        }
    );

    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear expense")
    }

    const data = await response.json()

    return data;
}
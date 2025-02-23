export interface ExpenseBlockProps {
    id: number;
    amount: number;
    type: "income" | "expense";
    description: string;
}
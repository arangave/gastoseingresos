import { ExpenseSchema } from "../schemas/expense.schema";
import { ExpenseBlockProps } from "./Expenses";

export interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (updatedExpense: ExpenseSchema) => void;
    title: string;
    type: "edit" | "delete";
    expense?: ExpenseBlockProps;
}
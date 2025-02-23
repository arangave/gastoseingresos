export async function deleteExpenseService(id: number) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/expenses/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        }
    );

    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar expense")
    }

    const data = await response.json()

    return data;
}
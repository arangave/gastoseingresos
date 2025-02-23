
export async function getExpensesService() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/expenses`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        }
    );

    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener datos")
    }

    const data = await response.json()

    return data;
}
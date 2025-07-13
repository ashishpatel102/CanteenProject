import URL from "./service";


const GetToCart = async () => {
    try {
        const response = await fetch(`${URL}/menu/Cart`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();

        if (!data.success) {
            console.error("❌ Failed to fetch cart items:", data.message);
            return { success: false, message: "Failed to fetch cart items" };
        }

        return data;

    } catch (error) {
        console.error("❌ Error fetching cart:", error);
        return { success: false, message: "Error fetching cart" };
    }
};

export default GetToCart;

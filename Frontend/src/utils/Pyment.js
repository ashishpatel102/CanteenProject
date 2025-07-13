import URL from "./service";



const handleOrder = async () => {
  setLoading(true);

  try {
    const response = await fetch(`${URL}/api/orders/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount, currency: "INR" }),
    });

    const data = await response.json();
    if (!data.success) throw new Error("Order Creation Failed");

    const options = {
      key: "YOUR_KEY_ID",
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Your Canteen",
      description: "Order Payment",
      order_id: data.order.id,
      handler: async function (response) {
        alert("✅ Payment Successful!");
        navigate("/orderall");
      },
      prefill: {
        name: "Ashish",
        email: "ashish@example.com",
        contact: address.phone,
      },
      theme: { color: "#3399cc" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    alert("❌ Payment Failed, Try Again!");
  } finally {
    setLoading(false);
  }
};

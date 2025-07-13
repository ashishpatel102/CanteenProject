import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PymetCard.css";
import URL from "../../utils/service";

const PaymentCard = ({ formData, OrderData, totalAmount, setShowPayment }) => {
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  useEffect(() => {
    const fetchKey = async () => {
      try {
        const response = await fetch(`${URL}/api/orders/get-razorpay-key`, {
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Failed to fetch Razorpay key");

        const data = await response.json();
        setRazorpayKey(data.key);
      } catch (error) {
        console.error("❌ Error fetching Razorpay Key:", error.message);
        alert("Error fetching payment gateway key. Please try again later.");
      }
    };
    fetchKey();
  }, []);

  const handlePayment = async () => {
    if (!razorpayKey) {
      alert("❌ Payment Failed: Razorpay Key Not Found!");
      return;
    }

    setLoading(true);
    try {
      const receiptId = "receipt_" + new Date().getTime();

      const response = await fetch(`${URL}/api/orders/create-order`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, currency: "INR", receipt: receiptId }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const data = await response.json();
      if (!data.success) throw new Error("Order Creation Failed");

      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Canteen",
        description: "Order Payment",
        order_id: data.order.id,
        handler: async (response) => {

          setPaymentStatus("success");

          try {
            const paymentResponse = await fetch(`${URL}/api/orders/save-payment`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.order.id,
                paymentId: response.razorpay_payment_id,
                amount: data.order.amount / 100,
                currency: data.order.currency,
                receipt: receiptId,
                status: "success",
                method: formData.method,
              }),
            });

            if (!paymentResponse.ok) throw new Error("Failed to save payment");

            const orderResponse = await fetch(`${URL}/api/orders`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...formData,
                ...OrderData,
                totalAmount,
                status: "Pending",
              }),
            });

            if (!orderResponse.ok) throw new Error("Failed to save order details");


          } catch (error) {
            console.error("❌ Failed to save payment/order:", error.message);
            alert("Payment successful but order processing failed! Contact support.");
          }

          setTimeout(() => {
            setShowPayment(false);
            navigate("/orderall");
          }, 3000);
        },
        theme: { color: "#28a745" },
        modal: {
          ondismiss: () => {
            setPaymentStatus("failed");
            alert("Payment process was cancelled.");
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error("❌ Payment Error:", error.message);
      alert("Payment failed! Please try again.");
      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay d-flex justify-content-center align-items-center">
      {paymentStatus === "success" ? (
        <div className="success-message">
          <h2 className="text-success">🎉 Thank You! 🎉</h2>
          <p>Payment Successful</p>
          <p>Amount Paid: ₹{totalAmount}</p>
        </div>
      ) : paymentStatus === "failed" ? (
        <div className="failed-message card p-3 rounded-3">
          <h2 className="text-danger">Payment Failed</h2>
          <p>Something went wrong. Please try again.</p>
          <div className="d-flex ">
            <button className="btn w-100 my-2" onClick={handlePayment}>
              Retry Payment
            </button>
            <button className="btn w-100 my-2 bg-light m-2 text-dark" onClick={() => setShowPayment(false)}>
              ❌  cancelled
            </button>
          </div>
        </div>
      ) : (
        <div className="modal-content p-4 rounded shadow-lg bg-white">
          <button className="btn-close position-absolute top-0 end-0 m-3" onClick={() => setShowPayment(false)}></button>
          <h2 className="mb-3 text-primary">Payment Details</h2>
          <p><strong>Amount:</strong> ₹{totalAmount}</p>
          <button className="btn btn-success w-100 my-2" onClick={handlePayment} disabled={loading || !razorpayKey}>
            {loading ? "Processing..." : "Pay with Razorpay"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentCard;

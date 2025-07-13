import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GetToCart from "../../utils/GetToCard";
import verify from "../../utils/Veryfy";
import { useCart } from "../../CartContext";
import URL from "../../utils/service";
import './cart.css'
const Cart = () => {
  verify("/cart");

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const data = await GetToCart();
      if (data.success) {
        setCartItems(data.data);
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const removeFromCart = async (id) => {
    try {
      const response = await fetch(`${URL}/menu/cart/remove`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.success) {
        const refreshed = await GetToCart();
        if (refreshed.success) {
          setCartItems(refreshed.data);
          updateCart();
        }
      } else {
        alert("Failed to remove item!");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleProductClick = (item) => {
    sessionStorage.setItem("Temp", JSON.stringify(item));
    navigate("/menu/ProductInfo");
  };

  // Step 1: Total of finalPrice (after item discount)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.finalPrice, 0);

  // Step 2: Check for 10% discount eligibility
  const eligibleForExtraDiscount = cartTotal >= 350;
  const totalCartDiscount = eligibleForExtraDiscount ? cartTotal * 0.1 : 0;

  // Step 3: Distribute cart-level discount
  const distributedCartItems = cartItems.map((item) => {
    const itemLevelDiscount = +(item.price - item.finalPrice).toFixed(2);
    const proportion = item.finalPrice / cartTotal;
    const cartLevelDiscount = eligibleForExtraDiscount
      ? +(totalCartDiscount * proportion).toFixed(2)
      : 0;
    const finalPrice = +(item.finalPrice - cartLevelDiscount).toFixed(2);
    const totalSavings = +(item.price - finalPrice).toFixed(2);

    return {
      ...item,
      itemLevelDiscount,
      cartLevelDiscount,
      finalPrice,
      totalSavings,
    };
  });

  // Step 4: Final total to pay
  const cartTotalWithExtraDiscount = distributedCartItems.reduce(
    (sum, item) => sum + item.finalPrice,
    0
  );

  const handleBuyNow = () => {
    sessionStorage.setItem("CheckoutItem", JSON.stringify(distributedCartItems));
    sessionStorage.setItem("TotalAmount", cartTotalWithExtraDiscount.toFixed(2));
    console.log(distributedCartItems);

    navigate("/checkout");
  };

  return (
    <div className="cart ">
      <h2 className="mb-4 text-center">Your Cart 🛒</h2>


      <div className="container mt-4 p-5" >


        {loading ? (
          <h4 className="text-center text-secondary">Loading cart...</h4>
        ) : cartItems.length === 0 ? (
          <h4 className="text-center text-warning">Your cart is empty! 😞</h4>
        ) : (
          distributedCartItems.map((item) => (
            <div
              key={item._id}
              className="col OrderAll-Card m-2"
              style={{ position: "relative" }}
            >
              <div
                onClick={() => handleProductClick(item)}
                style={{ cursor: "pointer" }}
              >
                <div className="OrderAll-Card-body d-flex align-items-start">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="img-fluid"
                    style={{ width: "60px", height: "60px", borderRadius: "10px" }}
                  />

                  <div className="ms-3 flex-grow-1">
                    <h5 className="mb-1">{item.name}</h5>
                    <p
                      className={`fw-bold ${item.available ? "text-success" : "text-danger"
                        }`}
                    >
                      {item.available ? "Available ✅" : "Unavailable ❌"}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <small className="text-muted">MRP: ₹{item.price}</small>
                      <small className="text-success">Item Discount: -₹{item.itemLevelDiscount}</small>
                      {eligibleForExtraDiscount && (
                        <small className="text-primary">
                          Cart Discount: -₹{item.cartLevelDiscount}
                        </small>
                      )}
                      <p className="fw-bold text-dark">
                        Final: ₹{item.finalPrice}
                      </p>
                      <small className="text-success">
                        You Saved ₹{item.totalSavings} 🎉
                      </small>
                    </div>
                  </div>

                  <button
                    className="btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item._id);
                    }}
                  >
                    <i className="fa-solid fa-trash text-dark"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

      </div>


      {cartItems.length !== 0 ? <div className="d-flex justify-content-between align-items-center p-3 flex-wrap text-center>
        <div className='text-center'>
          <h5>Subtotal: ₹{cartTotal.toFixed(2)}</h5>
          {eligibleForExtraDiscount ? (
            <h4 className="text-success">
              Total after 10% Cart Discount: ₹{cartTotalWithExtraDiscount.toFixed(2)}
            </h4>
          ) : (
            <p className="text-danger">
              Add ₹{(350 - cartTotal).toFixed(2)} more to get <b>10% OFF</b> on your order!
            </p>
          )}
        </div>

        <div className='text-center'>
          {!eligibleForExtraDiscount && (
            <button
              className="btn"
              onClick={() => navigate("/menu")}
            >
              Add More Items
            </button>
          )}
          <button className="btn btn-success" onClick={handleBuyNow}>
            Place Order
          </button>
        </div>
      </div> : ''
      }

    </div >
  );
};

export default Cart;

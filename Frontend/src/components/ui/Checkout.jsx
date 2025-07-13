import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Checkout.css";
import PaymentCard from "./PymentCard";
import useVerify from "../../utils/Veryfy";

export default function Checkout() {
  useVerify();

  const rawOrderData = JSON.parse(sessionStorage.getItem("CheckoutItem")) || {};
  const initialOrderList = Array.isArray(rawOrderData) ? rawOrderData : [rawOrderData];

  const [products, setProducts] = useState(
    initialOrderList.map((item) => ({ ...item, quantity: 1 }))
  );

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    country: "",
    fullAddress: "",
    method: "UPI",
    quantity: 1,
  });

  const [price, setPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  function InputHandler(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function recalculatePrices(updatedProducts) {
    let totalFinalAmount = 0;

    let totalOriginal = 0;
    let totalItemDiscounted = 0;

    const updated = updatedProducts.map((item) => {
      const itemPrice = item.price * item.quantity;
      const itemDiscount = item.discount ?? 0;
      const itemDiscountedPrice = itemPrice * (1 - itemDiscount / 100);

      totalOriginal += itemPrice;
      totalItemDiscounted += itemDiscountedPrice;
      totalFinalAmount += item.finalPrice * item.quantity;

      return {
        ...item,
        itemPrice,
        itemDiscountedPrice,
        totalItemDiscounted,
      };
    });

    // let price = item


    const totalCartDiscount = totalItemDiscounted - totalFinalAmount;

    const finalUpdated = updated.map((item) => {
      const cartShare = (item.itemDiscountedPrice / totalItemDiscounted) * totalCartDiscount;
      const finalPayable = item.itemDiscountedPrice

      return {
        ...item,
        itemLevelDiscount: (item.itemPrice - item.itemDiscountedPrice).toFixed(2),
        // cartLevelDiscount: cartShare.toFixed(2),
        // finalPayable: finalPayable.toFixed(2),
        totalSavings: (item.itemPrice - finalPayable).toFixed(2),
      };
    });

    setProducts(finalUpdated);
    setPrice(totalOriginal);
    setFinalPrice(totalFinalAmount);
    setFormData((prev) => ({
      ...prev,
      quantity: finalUpdated.reduce((a, b) => a + b.quantity, 0),
    }));
  }

  function priceHigh(index) {

    const updated = [...products];
    if (updated[index].quantity + 1 > 5) return alert("Only 5 quantity can be bought");
    if (updated[index].quantity + 1 > (updated[index].stock_quantity || 0))
      return alert("Stock not available");
    updated[index].quantity += 1;
    recalculatePrices(updated);
    console.log(products);


  }

  function priceLow(index) {
    const updated = [...products];
    if (updated[index].quantity - 1 < 1) return alert("At least 1 quantity is required");
    updated[index].quantity -= 1;
    recalculatePrices(updated);
  }

  useEffect(() => {
    recalculatePrices(products);
  }, []);

  function Submit(e) {
    e.preventDefault();
    if (!formData.email.endsWith("@gmail.com") || formData.email.length < 12) {
      return alert("Enter valid Gmail address");
    }
    if (formData.method === "COD") {
      alert("Cash on Delivery Not Available");
    } else {
      setShowPayment(true);
    }
  }

  if (!products || products.length === 0) return <h2>No products to checkout!</h2>;

  return (
    <div className="checkout-container">
      {/* <div className="payment-card-main">
        <form onSubmit={Submit} style={{ width: "100%" }}>
          <div className="payment-card">
            <div className="card-details">
              <h2 className="text-white">Your Information</h2>
              <div className="mb-3 input-group">
                <input type="text" className="form-control" name="fullname" onChange={InputHandler} placeholder="Full name" required />
                <input type="text" className="form-control" name="city" onChange={InputHandler} placeholder="City" required />
              </div>
              <div className="mb-3 input-group">
                <input type="email" className="form-control" name="email" onChange={InputHandler} placeholder="Email" required />
                <input type="text" className="form-control" name="pincode" onChange={InputHandler} placeholder="Pin Code" required />
              </div>
              <div className="mb-3 input-group">
                <input type="text" className="form-control" name="phone" onChange={InputHandler} placeholder="Phone number" required />
                <select className="form-select" name="country" onChange={InputHandler} required>
                  <option value="">Select country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
              </div>
              <div className="mb-3 input-group">
                <input type="text" className="form-control" name="fullAddress" onChange={InputHandler} placeholder="Street address" required />
              </div>
              <div className="mb-3 input-group">
                <select className="form-select" name="method" onChange={InputHandler} required>
                  <option value="UPI">UPI</option>
                  <option value="COD">COD</option>
                </select>
              </div>
              <p className="valid-date text-white">Please check all details before proceeding.</p>
            </div>
          </div>

          <div className="checkout-box">
            <h3>Order Summary</h3>
            {products.map((item, index) => (
              <div key={index} className="product-box mb-4">
                <img src={item.image_url} alt="Product" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: '50%' }} />
                <div className="price-section" style={{ display: 'block' }}>
                  <h5 className="text-success">Final: ₹{item.finalPrice * item.quantity}</h5>
                  <p className="mb-1 text-danger">M.R.P: ₹{item.itemPrice}</p>
                  <p className="mb-1 text-warning">Item Discount: ₹{item.itemLevelDiscount}</p>
                  <p className="mb-1 text-primary">Cart Discount: ₹{item.cartLevelDiscount}</p>
                  <small className="text-muted">You Saved: ₹{item.totalSavings}</small>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <button className="btn border" onClick={(e) => { e.preventDefault(); priceLow(index); }}>-</button>
                  <b>{item.quantity}</b>
                  <button className="btn border" onClick={(e) => { e.preventDefault(); priceHigh(index); }}>+</button>
                </div>
                <div className="quantity text-black">In Stock: {item.stock_quantity > 0 ? item.stock_quantity : "Out of Stock"}</div>
              </div>
            ))}
            <hr />
            <div className="summary-details">
              <p>Sub Total: <span>₹{price.toFixed(2)}</span></p>
              <p>Total Quantity: <span>{products.reduce((a, b) => a + b.quantity, 0)}</span></p>
              <p>Total Savings: <span>₹{(price - finalPrice).toFixed(2)}</span></p>
              {console.log(products)
              }
              <h5>Final Amount: <span className="text-success">₹{finalPrice.toFixed(2)}</span></h5>
            </div>
            <label className="form-check-label">
              <input type="checkbox" className="form-check-input me-2" required />
              I agree with Terms of Use
            </label>
            <button className="pay-btn" type="submit">ORDER</button>
          </div>
        </form>

        {showPayment && (
          <div style={{ position: "absolute", zIndex: 10 }}>

            <PaymentCard
              formData={formData}
              OrderData={products}
              totalAmount={finalPrice}
              setShowPayment={setShowPayment}
            />
          </div>
        )}
      </div> */}

      <div className="item checkbox-item">

        <div className="checkout-box">
          <h3>Order Summary</h3>
          {products.map((item, index) => (
            <div key={index} className="product-box mb-4">
              <img src={item.image_url} alt="Product" style={{ width: 150, height: 150, objectFit: "cover", borderRadius: '50%' }} />
              <div className="price-section" style={{ display: 'block' }}>
                <h5 className="text-success">Final: ₹{item.finalPrice * item.quantity}</h5>
                <p className="mb-1 text-danger">M.R.P: ₹{item.itemPrice}</p>
                <p className="mb-1 text-warning">Item Discount: ₹{item.itemLevelDiscount}</p>
                <p className="mb-1 text-primary">Cart Discount: ₹{item.cartLevelDiscount}</p>
                <small className="text-muted">You Saved: ₹{item.totalSavings}</small>
              </div>
              <div className="mt-2">
                <button className="btn border" onClick={(e) => { e.preventDefault(); priceLow(index); }}>-</button>
                <b>{item.quantity}</b>
                <button className="btn border" onClick={(e) => { e.preventDefault(); priceHigh(index); }}>+</button>
              </div>
              <div className="quantity text-black">In Stock: {item.stock_quantity > 0 ? item.stock_quantity : "Out of Stock"}</div>
            </div>
          ))}
          <hr />
          <div className="summary-details">
            <p>Sub Total: <span>₹{price.toFixed(2)}</span></p>
            <p>Total Quantity: <span>{products.reduce((a, b) => a + b.quantity, 0)}</span></p>
            <p>Total Savings: <span>₹{(price - finalPrice).toFixed(2)}</span></p>
            {console.log(products)
            }
            <h5>Final Amount: <span className="text-success">₹{finalPrice.toFixed(2)}</span></h5>
          </div>
        </div>
      </div>

      <div className="item checkbox-item">
        <form onSubmit={Submit}>
          <div >
            <div>
              <h2>Your Information</h2>
              <div className="mb-3 input-group">
                <input type="text" className="form-control" name="fullname" onChange={InputHandler} placeholder="Full name" required />
                <input type="text" className="form-control" name="city" onChange={InputHandler} placeholder="City" required />
              </div>
              <div className="mb-3 input-group">
                <input type="email" className="form-control" name="email" onChange={InputHandler} placeholder="Email" required />
                <input type="text" className="form-control" name="pincode" onChange={InputHandler} placeholder="Pin Code" required />
              </div>
              <div className="mb-3 input-group">
                <input type="text" className="form-control" name="phone" onChange={InputHandler} placeholder="Phone number" required />
                <select className="form-select" name="country" onChange={InputHandler} required>
                  <option value="">Select country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
              </div>
              <div className="mb-3 input-group">
                <input type="text" className="form-control" name="fullAddress" onChange={InputHandler} placeholder="Street address" required />
              </div>
              <div className="mb-3 input-group">
                <select className="form-select" name="method" onChange={InputHandler} required>
                  <option value="UPI">UPI</option>
                  <option value="COD">COD</option>
                </select>
              </div>
              <p className="valid-date text-white">Please check all details before proceeding.</p>
            </div>
          </div>

          <label className="form-check-label">
            <input type="checkbox" className="form-check-input me-2" required />
            I agree with Terms of Use
          </label>

          {showPayment && (
            <div style={{ position: "absolute", zIndex: 10 }}>

              <PaymentCard
                formData={formData}
                OrderData={products}
                totalAmount={finalPrice}
                setShowPayment={setShowPayment}
              />
            </div>
          )}
          <br /><br />
          <button className="pay-btn btn" type="submit">ORDER</button>
        </form>
      </div>
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductInfo.css";
import useVerify from "../../utils/Veryfy";

const ProductInfo = () => {
    useVerify();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem("Temp"));
        if (data) {
            setProduct(data);
        }
    }, []);

    if (!product) {
        return <h2 className="error-message">No product data available!</h2>;
    }

    // Calculate final price after discount
    const discountPrice = product.price * (product.discount / 100);
    const finalPrice = product.price - discountPrice;

    const handleBuyNow = () => {
        sessionStorage.setItem("CheckoutItem", JSON.stringify(product));
        navigate("/checkout");
    };

    return (
        <div className="product-container">
            <div className="product-card">
                {/* Product Image */}
                <div className="image-container">
                    <img src={product.image_url} alt={product.name} className="product-image" />
                </div>

                {/* Product Details */}
                <div className="details-container">
                    <h2 className="product-title text-black">{product.name}</h2>
                    <p className="product-description text-black">{product.description}</p>

                    <div className="price-section">
                        <h3 className="discounted-price text-black">₹{finalPrice.toFixed(2)}</h3>
                        <h3><span> M.R.P : </span></h3>
                        <h3 className="original-price text-black">₹{product.price} </h3>
                        <h3>({product.discount}% OFF)</h3>
                        <span className="discount-badge">{product.discount}% OFF</span>
                    </div>
                    <p>Save extra with No Cost EMI</p>
                    <p>FREE delivery</p>

                    <div className={`quantity ${product.stock_quantity === 0 ? 'out' : 'in'}`}>
                        <b>Quantity:</b> {product.stock_quantity > 0 ? product.stock_quantity : "Out of Stock"}
                    </div>


                    {/* Buttons */}
                    <div className="buttons">
                        <button className="buy-now" onClick={handleBuyNow}>
                            <i className="fa-solid fa-bolt"></i> Buy Now
                        </button>
                    </div>

                    {/* Additional Product Info */}
                    <div className="info-box ">
                        <h3 className="text-black">Product Information</h3>
                        <ul>
                            <li><b>Stock:</b> {product.stock_quantity}</li>
                            <li><b>Available:</b> {product.stock_quantity ? "Yes" : "No"}</li>
                            <li><b>Category:</b> {product.category || "N/A"}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;

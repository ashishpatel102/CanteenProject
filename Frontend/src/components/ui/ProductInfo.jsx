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

    const discountPrice = product.price * (product.discount / 100);
    const finalPrice = product.price - discountPrice;

    const handleBuyNow = () => {
        sessionStorage.setItem("CheckoutItem", JSON.stringify(product));
        navigate("/checkout");
    };

    return (
        <div className="product-container container">

            <div className="product-card">
                <div className="image-container">
                    <img src={product.image_url} alt={product.name} className="product-image" />
                </div>

                <div className="details-container">
                    <h2 className="product-title text-black">{product.name}</h2>
                    <p className="product-description text-black">{product.description}</p>

                    <div className="price-section">
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'green' }}>
                            ₹{finalPrice.toFixed(2)}
                        </span>
                        &nbsp;&nbsp;
                        <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}>
                            M.R.P:₹{product.price.toLocaleString()}
                        </span>
                        <span style={{ color: 'red', fontWeight: '500' }}>
                            ({product.discount}% OFF)
                        </span>
                    </div>

                    <p>Save extra with No Cost EMI</p>
                    <p>FREE delivery</p>

                    <div className={`quantity ${product.stock_quantity === 0 ? 'out' : 'in'}`}>
                        <b>Quantity:</b> {product.stock_quantity > 0 ? product.stock_quantity : "Out of Stock"}
                    </div>



                    <div className="info-box">
                        <h3 className="text-black">Product Information</h3>
                        <ul>
                            <li><b>Stock:</b> {product.stock_quantity}</li>
                            <li><b>Available:</b> {product.stock_quantity > 0 ? "Yes" : "No"}</li>
                            <li><b>Category:</b> {product.category || "N/A"}</li>
                            <li><b>Brand:</b> {product.brand || "Not Specified"}</li>
                            <li><b>Color:</b> {product.color || "Default Color"}</li>
                            <li><b>Material:</b> {product.material || "N/A"}</li>
                            <li><b>Warranty:</b> {product.warranty || "No Warranty"}</li>
                            <li><b>Seller:</b> {product.seller || "Verified Seller"}</li>
                            <li><b>Return Policy:</b> {product.return_policy || "7-Day Return Available"}</li>
                            <li><b>Rating:</b>
                                {
                                    product.rating ? (
                                        <>
                                            <span style={{ color: 'gold' }}>
                                                <i className="fa-solid fa-star"></i> {product.rating}
                                            </span>
                                            &nbsp;
                                            ({product.reviews || 0} reviews)
                                        </>
                                    ) : "No Ratings Yet"
                                }
                            </li>
                        </ul>
                    </div>
                    <div className="buttons">
                        <button className="buy-now" onClick={handleBuyNow}>
                            <i className="fa-solid fa-bolt"></i> Buy Now
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ProductInfo;

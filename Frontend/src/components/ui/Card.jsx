// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { useCart } from "../../CartContext";
// import "./Card.css";
// import URL from "../../utils/service";

// const Card = ({ item }) => {

//   const { updateCart } = useCart();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   function fetchItem() {
//     try {
//       sessionStorage.setItem("Temp", JSON.stringify(item));
//     } catch (error) {
//       alert("Unwanted Error");
//     }
//   }

//   const AddToCart = async (id) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${URL}/menu/cart`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         alert("✅ Item added to cart!");
//         updateCart();
//       } else {
//         alert("❌ Failed to add item to cart.");
//       }
//     } catch (error) {
//       console.error("Item added error", error);
//     }
//     setLoading(false);
//   };

//   const handleBuyNow = () => {
//     sessionStorage.setItem("CheckoutItem", JSON.stringify(item));
//     navigate("/checkout");
//   };

//   const discount = item.discount || 0;
//   const finalPrice = item.price - (item.price * discount) / 100;

//   return (
//     <div className="shadow-sm p-3 rounded position-relative card">

//       {/* {discount > 0 && (
//         <div className="discount-badge">
//           {discount}% off
//         </div>
//       )} */}

//       {/* <div className="card-hover">
//         <ul className="icon-list" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <li><i className="fa-solid fa-heart text-danger"></i></li>
//           <li>
//             <Link to="/menu/ProductInfo" onClick={fetchItem} className="a">
//               <i className="fa-solid fa-eye text-primary"></i>
//             </Link>
//           </li>
//           <li onClick={() => AddToCart(item._id)} className="cart-btn">
//             {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cart-plus"></i>}
//           </li>
//         </ul>
//       </div> */}



//       <div className="img text-center ">
//         <Link to="/menu/ProductInfo" onClick={fetchItem} >
//           <img src={item.image_url} alt={item.name} className="img-fluid rounded" width='300px' height='100px' />
//         </Link>
//       </div>

//       <div className="text-center mt-2">
//         <h5 className="fw-bold">{item.name}</h5>
//         <p className="small text-muted" id="hid">
//           {item.description}{" "}
//           <Link to="/menu/ProductInfo" onClick={fetchItem} className="a">More</Link>
//         </p>


//         <div>
//           {discount > 0 ? (
//             <h6 className="fw-bold text-success">
//               ₹{finalPrice.toFixed(2)}{" "}
//               <span className="text-muted small"> M.R.P : </span>
//               <span className="text-muted small" style={{ textDecoration: "line-through" }}>
//                 ₹{item.price}
//               </span>
//               <span className="text-muted small"> ({discount}% off)</span>
//             </h6>
//           ) : (
//             <h6 className="fw-bold text-success">₹{item.price}</h6>
//           )}

//           <button onClick={handleBuyNow} className="btn btn-sm btn-warning fw-bold">BUY</button>
//         </div>
//       </div>
//     </div>
//   );
// };



import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../CartContext";
import "./Card.css";
import URL from "../../utils/service";
const Card = ({ item }) => {

  const { updateCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function fetchItem() {
    try {
      sessionStorage.setItem("Temp", JSON.stringify(item));
    } catch (error) {
      alert("Unwanted Error");
    }
  }

  const AddToCart = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/menu/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.success) {
        alert("✅ Item added to cart!");
        updateCart();
      } else {
        alert("❌ Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Item added error", error);
    }
    setLoading(false);
  };

  const handleBuyNow = () => {
    sessionStorage.setItem("CheckoutItem", JSON.stringify(item));
    navigate("/checkout");
  };

  const discount = item.discount || 0;
  const finalPrice = item.price - (item.price * discount) / 100;
  return (
    <>
      <div className="card mb-3 item">
        <div className="row g-0">
          <div className="col-md-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Link to="/menu/ProductInfo" onClick={fetchItem} >
              <img src={item.image_url} alt={item.name} className="img-fluid rounded" />
            </Link>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <p className="card-text">

                {item.description}{" "}
                <Link to="/menu/ProductInfo" onClick={fetchItem}>More</Link>
              </p>

              {discount > 0 ? (
                <h6 className="fw-bold text-success">
                  ₹{finalPrice.toFixed(2)}{" "}
                  <span className="text-muted small"> M.R.P : </span>
                  <span className="text-muted small" style={{ textDecoration: "line-through" }}>
                    ₹{item.price}
                  </span>
                  <span className="text-muted small"> ({discount}% off)</span>
                </h6>
              ) : (
                <h6 className="fw-bold text-success">₹{item.price}</h6>
              )}

              <button onClick={() => AddToCart(item._id)} className="btn">Add Item
                {loading ? <i className="fa-solid fa-spinner fa-spin m-1"></i> : <i className="fa-solid fa-cart-plus m-1"></i>}
              </button>

              <button onClick={handleBuyNow} className="btn m-1">BUY</button>

              <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default Card;

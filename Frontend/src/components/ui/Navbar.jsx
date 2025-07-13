import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../CartContext";
import "./Navbar.css";
import useVerify from "../../utils/Veryfy";
import URL from "../../utils/service";

const Navbar = () => {
  // useVerify();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, updateCart, setCartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${URL}/Auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        alert("Logout Successful!");
        logout();
        setCartCount(0);
        updateCart();
        navigate("/login");
      } else {
        alert("Logout failed: " + data.message);
      }
    } catch (error) {
      alert("Something went wrong while logging out!");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container" style={{ position: 'relative' }}>

          <Link className="logo" to="/">
            ❥➻....Food....➻❥
          </Link>

          <button className="menu-btn btn text-black" style={{ zIndex: '10' }} onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>

          {user?.role !== "admin" && (
            <ul className={`nav-links ${menuOpen ? "open" : ""}`} style={{ zIndex: '1' }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/orderall">Orders</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          )}
          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            {user?.role === "admin" && (
              <li><Link className="btn admin-btn" to="/admin/AdminDashboard">Dashboard</Link></li>
            )}
          </ul>

          <div className="nav-right" style={{ display: 'flex' }}>

            {user?.role !== "admin" ? <Link className="cart-btn" to="/cart">
              <i className="fa-solid fa-shopping-cart"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link> : ''
            }
            <div className="user-menu">
              <button className="user-btn" >
                👤 {user?.Username} <i className="fa-solid fa-chevron-down"></i>
              </button>
              <div className="dropdown" >
                <Link to="/" data-bs-toggle="modal" data-bs-target="#editProfileModal" >Profile</Link>
                <Link to="/orderall">My Orders</Link>
                <button onClick={handleLogout} className="btn m-2">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content" >

            <div className="modal-header">
              <h5 className="modal-title" id="editProfileModalLabel">Your Profile</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body text-center">

              <div className="profile-img mb-3">
                <img
                  src="https://i.pinimg.com/736x/99/d0/7f/99d07f72ea74f29fe21833964704cdc9.jpg"
                  alt="Profile"
                  className="img-fluid rounded-circle border border-3"
                  style={{ width: "120px", height: "120px" }}
                />

              </div>
              {user && <>
                <h4>{user.Username}</h4>
                <p className="text-muted">Full Stack Developer</p>

                <div className="text-start mt-4">
                  <p><strong>Email : </strong> {user.Email}</p>
                  <p><strong>Phone : </strong> {user.Phone}</p>
                  <p><strong>Address : </strong> Patna, Bihar, India</p>
                  {/* <p><strong>Member Since:</strong> Jan 2024</p> */}
                </div>
              </>}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Navbar;

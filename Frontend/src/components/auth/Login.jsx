import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCart } from "../../CartContext";

import './Auth.css'
import URL from "../../utils/service";

const Login = ({ setError, error }) => {
  const temp = { Username: '', Password: '' }

  const [getFormValue, setFormValue] = useState(temp);
  const [showPassword, setShowPassword] = useState(false);
  const [Disable, setDisable] = useState(true);
  const { login } = useAuth();
  const { setCartCount, updateCart } = useCart();
  const navigate = useNavigate();

  function FormHandler(e) {

    const { name, value } = e.target;
    setFormValue({ ...getFormValue, [name]: value });

    if (getFormValue.Password && getFormValue.Username) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!(getFormValue.Password.length > 7)) {
      setError('Please Enter 8 Digit Password ');
      return;
    }

    try {
      const response = await fetch(`${URL}/Auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...getFormValue }),
      });

      const data = await response.json();

      if (response.ok) {
        setError(data.message, 'success');
        login(data.data);
        updateCart();
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

  }

  return (

    <div id="auth-main-container" className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 text-dark" id="auth-container" style={{ maxWidth: "400px", borderRadius: "15px" }}>
        <h2 className="text-center mb-3 text-primary" style={{ fontWeight: 'bolder' }}>User Login</h2>

        {error && <p className="alert alert-danger text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-3 input-group ">
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              onChange={FormHandler}
              name="Username"
              value={(getFormValue.Username)}
              required
            />
          </div>

          <div className="mb-3 input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter password"
              onChange={FormHandler}
              name="Password"
              value={(getFormValue.Password).trim()}
              style={{ borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="btn btn-dark w-100 fw-bold" disabled={Disable}>Login</button>
        </form>

        <div className="text-center mt-3">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          <Link className="m-2 text-dark" to="/admin/login">Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

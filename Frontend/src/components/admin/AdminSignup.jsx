import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import URL from "../../utils/service";

const AdminSignup = ({ setError, error }) => {
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Phone: "",
    Password: "",
    ConfirmPassword: "",
    SecretKey: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSignup(e) {
    e.preventDefault();

    if (formData.Password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    try {
      const response = await fetch(`${URL}/admin/signup`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Admin Registered Successfully!");
        navigate("/admin/AdminDashboard");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
    >
      <div
        className="p-4 shadow-lg border-0 mx-auto"
        style={{
          background: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(15px)",
          borderRadius: "15px",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
          width: "95%",
          maxWidth: "400px",
          padding: "2rem",
        }}
      >
        <h2 className="text-center mb-3 text-dark" style={{ fontWeight: 'bolder' }}>Admin Signup</h2>
        <br />

        {error && <p className="alert alert-danger text-center">{error}</p>}

        <form onSubmit={handleSignup}>
          <div className="mb-3 input-group">
            <input
              type="text"
              name="Username"
              placeholder="Username"
              className="form-control custom-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <input
              type="email"
              name="Email"
              placeholder="Email"
              className="form-control custom-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <input
              type="text"
              name="Phone"
              placeholder="Phone (Optional)"
              className="form-control custom-input"
              onChange={handleChange}
            />
          </div>


          <div className="row mb-3">
            <div className="col-6">
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="Password"
                  placeholder="Password"
                  className="form-control custom-input"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="ConfirmPassword"
                  placeholder="Confirm"
                  className="form-control custom-input"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-3 input-group">
            <input
              type="text"
              name="SecretKey"
              placeholder="Admin Secret Key"
              className="form-control custom-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">

            <button type="submit" className="btn btn-dark w-100 fw-bold">
              Sign Up
            </button>
          </div>

          <br />
          <Link className="text-dark" to={'/admin/login'}>Login Account</Link>
          <Link className="text-dark m-4" to="/login">User Login</Link>
        </form>
      </div>


      <style>
        {`
          .custom-input {
            background-color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(0, 0, 0, 0.2);
            transition: 0.3s;
          }
          .custom-input:focus {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            border-color: rgba(0, 0, 0, 0.4);
          }
        `}
      </style>
    </div>
  );
};

export default AdminSignup;

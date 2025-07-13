import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import URL from "../../utils/service";

const SignUp = ({ setError, error }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Disable, setDisable] = useState(true);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (formData.username && formData.email && formData.phone && formData.password && formData.confirmPassword) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }


    if (!formData.email.endsWith('@gmail.com')) {
      setError("Email not valid. Please enter a valid Gmail address (example@gmail.com).");
      return;
    }

    if (formData.email.length < 12) {
      setError("Email is too short. Please enter a valid email with at least 12 characters.");
      return;
    }

    try {
      const response = await fetch(`${URL}/Auth/signup`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: formData.username,
          Email: formData.email,
          Phone: formData.phone,
          Password: formData.password,
          role: "user",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setError(data.message, 'success');
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div id="auth-main-container" className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div id="auth-container" className="p-4 w-100 text-dark" style={{ maxWidth: "400px", borderRadius: "15px" }}>
        <h2 className="text-center mb-3 text-primary" style={{ fontWeight: 'bolder' }}>User Signup</h2>
        {error && <p className="alert alert-danger text-center">{error}</p>}

        <form onSubmit={handleSignup}>
          <div className="mb-3 input-group">
            <input type="text" name="username" placeholder="Username" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3 input-group">
            <input type="email" name="email" placeholder="Email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3 input-group">
            <input type="text" name="phone" placeholder="Phone (Optional)" className="form-control" onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="mb-3 input-group">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="form-control" onChange={handleChange} required />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="mb-3 input-group">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" className="form-control" onChange={handleChange} required />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-bold" disabled={Disable}>Sign Up</button>

        </form>

        <div className="text-center mt-3">
          <p>Already have an account? <Link to="/login">Login</Link></p>
          <Link className="m-2 text-dark" to="/admin/login">Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

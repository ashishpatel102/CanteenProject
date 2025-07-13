import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import URL from "../../utils/service";

const AdminLogin = ({ setError, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${URL}/admin/login`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Username: username, Password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful!");
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/AdminDashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"

    >
      <div
        className="p-4 shadow-lg border-0"
        style={{
          maxWidth: "400px",
          background: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(12px)",
          borderRadius: "12px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 className="text-center mb-3" style={{ fontWeight: 'bolder' }}>Admin Login</h2><br />

        {error && <p className="alert alert-danger text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-3 input-group">
            <label className="form-label" style={{ display: "flex", justifyContent: "start" }}>
              Username
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-transparent"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3 input-group">
            <label className="form-label" style={{ display: "flex", justifyContent: "start" }}>
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control bg-transparent"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100 fw-bold mt-2">
            Login
          </button>
          <br /><br />
          <Link className="text-dark " to={'/admin/signup'}>Create Account</Link>
          <Link className="text-dark m-4" to="/login">User Login</Link>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

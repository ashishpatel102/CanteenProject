import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Contact.css";
import useVerify from "../utils/Veryfy";
import URL from "../utils/service";

const Contact = () => {
  useVerify();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const response = await fetch(`${URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      setStatusMsg({ type: "success", text: "Message Sent Successfully! 🚀" });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatusMsg({ type: "error", text: error.message || "Something went wrong. Please try again." });
    }

    setLoading(false);
  };

  return (
    <div className="container p-0 m-0 " style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>

      <div className="row item">
        <div className="py-5 text-white" style={{ background: 'linear-gradient(to right, #1f4037, #99f2c8)' }}>
          <h2 className="text-center fw-bold">Contact Us</h2>
          <p className="text-center text-white">We would love to hear from you!</p>
        </div>
        <div className="col-md-6 p-4 bg-light rounded shadow-sm">
          <h4 className="fw-bold">Get In Touch</h4>
          <p className="text-muted">Feel free to reach out to us.</p>
          <p><FaMapMarkerAlt /> 123, Tech Street, India</p>
          <p><FaPhone /> +91 98765 43210</p>
          <p><FaEnvelope /> support@example.com</p>
          <div className="d-flex gap-3 mt-3">
            <a href="#"><FaFacebook className="social-icon" /></a>
            <a href="#"><FaTwitter className="social-icon" /></a>
            <a href="#"><FaInstagram className="social-icon" /></a>
            <a href="#"><FaLinkedin className="social-icon" /></a>
          </div>
        </div>

        <div className="col-md-6 p-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <h4 className="fw-bold">Send a Message</h4>

            {/* ✅ Show Success or Error Message */}
            {statusMsg.text && (
              <p className={`alert ${statusMsg.type === "success" ? "alert-success" : "alert-danger"}`}>
                {statusMsg.text}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input type="text" className="form-control" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" name="email" placeholder="E-mail address" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <textarea className="form-control" name="message" placeholder="Message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="btn btn-warning w-100" disabled={loading}>
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

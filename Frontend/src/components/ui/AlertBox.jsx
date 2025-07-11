import { useState, useEffect } from "react";

export default function AlertBox({ message, type,setError }) {
  const [alert, setAlert] = useState(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (message) {
      setAlert({ message, type });
      setTimeout(() => setVisible(true), 10);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setAlert(null), 300);
        setError('');
      }, 1000);
      
      
      return () => clearTimeout(timer);
    }
  }, [message, type]);

  return (
    alert && (
      <div
        style={{
          position: "fixed",
          top: "50%",
          right: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 20px",
          color: "white",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          backgroundColor: alert.type === "success" ? "#10b981" : "#ef4444",
          zIndex: 1000,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px) scale(1)" : "translateY(-100px) scale(0.9)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
          {alert.type === "success" ? "✔" : "✖"}
        </span>
        <span>{alert.message}</span>
      </div>
    )
  );
}

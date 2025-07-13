import React, { useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import Signup from "./components/auth/SignUp";
import MenuItem from "./components/ui/MenuItem";
import ProductInfo from "./components/ui/ProductInfo";
import Cart from "./components/ui/Cart";
import Login from "./components/auth/Login";
import Orders from "./components/ui/Orders";
import Checkout from "./components/ui/Checkout";
import Contact from "./pages/Contact";
import Copyright from "./components/ui/Copyright";
import OrderAll from "./components/ui/OrderAll";
import AdminSignup from "./components/admin/AdminSignup";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard/AdminDashboard";
import PymetCard from "./components/ui/PymentCard";
import AlertBox from "./components/ui/AlertBox";

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  const [error, setErrorMsg] = useState('');
  const [errorType, setType] = useState('');

  function setError(msg, type) {
    setErrorMsg(msg);
    setType(type);
  }

  const Router = createBrowserRouter([
    {
      path: "*",
      element: <h1 style={{ textAlign: "center", marginTop: "20px", color: "red" }}>❌ Page Not Found!</h1>
    },

    { path: "/login", element: <Login setError={setError} error={error} /> },
    { path: "/signup", element: <Signup setError={setError} error={error} /> },
    { path: "/admin/login", element: <AdminLogin setError={setError} error={error} /> },
    { path: "/admin/signup", element: <AdminSignup setError={setError} error={error} /> },

    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/menu", element: <MenuItem /> },
        { path: "/menu/ProductInfo", element: <ProductInfo /> },
        { path: "/cart", element: <Cart /> },
        { path: "/orders", element: <Orders /> },
        { path: "/checkout", element: <Checkout /> },
        { path: "/adminLogin", element: <AdminLogin /> },
        { path: "/contact", element: <Contact /> },
        { path: "/orderall", element: <OrderAll /> },
        { path: "/admin/AdminDashboard", element: <AdminDashboard /> },
        { path: "/api/pyment", element: <PymetCard totalAmount={10} address={"mau Aima"} onClose="ture" /> },
      ],
    },
  ]);
  return <>
    <AlertBox message={error} type={errorType} setError={setError} />
    <RouterProvider router={Router} />
  </>
}

export default App;

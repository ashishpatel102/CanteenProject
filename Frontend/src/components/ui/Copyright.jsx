import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Copyright = () => {
  return (
    <footer className="bg-dark text-white text-center py-4">
      <div className="container">
        <p className="mb-1">
          © {new Date().getFullYear()} YourCompany. All Rights Reserved.
        </p>
        <p className="mb-2">Designed with ❤️ by YourCompany</p>

        <div className="d-flex justify-content-center gap-3">
          <a href="#" className="text-white fs-5">
            <FaFacebook />
          </a>
          <a href="#" className="text-white fs-5">
            <FaTwitter />
          </a>
          <a href="#" className="text-white fs-5">
            <FaInstagram />
          </a>
          <a href="#" className="text-white fs-5">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
    
  );
};

export default Copyright;

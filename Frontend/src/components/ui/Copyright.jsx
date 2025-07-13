import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Copyright = () => {
  return (
    <footer className="text-center ">
      <hr />
      <div className="container">
        <p className="mb-1">
          © {new Date().getFullYear()} Food. All Rights Reserved.
        </p>
        <p className="mb-2">Designed with ❤️ by 🦋⃟ᴠͥɪͣᴘͫ✮⃝Ashish Patel𝄟⃝</p>

        <div className="d-flex justify-content-center gap-3">
          <a href="#" className="fs-5">
            <FaFacebook />
          </a>
          <a href="#" className="fs-5">
            <FaTwitter />
          </a>
          <a href="#" className="fs-5">
            <FaInstagram />
          </a>
          <a href="#" className=" fs-5">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>

  );
};

export default Copyright;

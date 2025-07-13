import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import "./SidebarToggle.css";

const SidebarToggleButton = ({ toggleSidebar }) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const btnRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });


  const handleMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };


  const handleMouseMove = (e) => {
    if (dragging.current) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };


  const handleMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      className="sidebar-toggle"
      onClick={toggleSidebar}
      onMouseDown={handleMouseDown}
      style={{ left: position.x, top: position.y }}
    >
      <FaBars size={24} />
    </button>
  );
};

export default SidebarToggleButton;

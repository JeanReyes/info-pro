import { useState } from "react";
import './sidebar.style.css'

// interface Props {
//   toggleSidebar: () => void;
//   isOpen: boolean;
// }

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    console.log("Toggle Navbar");
    setIsOpen(!isOpen);
  };

  return (
    <>
    <div>
      <button className="menu-btn" onClick={toggleNavbar}>
        ☰
      </button>
    </div>
      <div className={`navbar ${isOpen ? "open" : ""}`}>
        <div className="navbar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={toggleNavbar}>
            ×
          </button>
        </div>
        <ul className="navbar-menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/info/nginx">Nginx</a>
          </li>
          <li>
            <a href="/info/docker">Docker</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
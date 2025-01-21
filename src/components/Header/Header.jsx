import React, { useState, useEffect, useContext } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../Login/Auth";
import { LoginResponseContext } from "../../ContextAPI/ResponseContex";

const Header = () => {
  const {LoginResponse,setLoginResponse}=useContext(LoginResponseContext)
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // console.log(isLoggedIn);
  
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate("/"); // Navigate back to home after logout
  };

  // Check if the user is logged in on component mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true)
    }
    setIsLoggedIn(!!token); // Update state based on token existence
  }, [LoginResponse]);

  const handleLoginClick = () => setShowAuth(true);
  const closeAuthModal = () => setShowAuth(false);

  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <Link to={"/"}>
          <img src="./logo.png" alt="logo" width={100} />
        </Link>

        {/* menu */}
        <div className="flexCenter h-menu" style={getMenuStyles(menuOpened)}>
          <a href="#residencies" style={{ textDecoration: "none", color: "black", fontWeight:"bold" }}>
            Residencies
          </a>
          <Link to={"/properties"} style={{ textDecoration: "none", color: "black" , fontWeight:"bold" }}>
            Properties
          </Link>

          {/* Dynamically change button */}
          {isLoggedIn ? (
            <>
            <Link to={"/addproperty"} style={{ textDecoration: "none", color: "black" , fontWeight:"bold" }}>
              Add Property
            </Link>
          
            <Link to={"/Bookings"} style={{ textDecoration: "none", color: "black" , fontWeight:"bold" }}>
              bookings
            </Link>
            </>
          ): (
            <Link to={"/getstarted"} style={{ textDecoration: "none", color: "black" , fontWeight:"bold" }}>
              Get Started
            </Link>
          )}

          {/* Conditional Login/Logout Button */}
          <button
            onClick={isLoggedIn ? handleLogout : handleLoginClick}
            className="button"
            style={{ textDecoration: "none", color: "black" }}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>

        {/* for medium and small screens */}
        <div className="menu-icon" onClick={() => setMenuOpened((prev) => !prev)}>
          <BiMenuAltRight size={30} />
        </div>
      </div>

      {/* Render Auth modal conditionally */}
      {showAuth && (
        <div className="modal-overlay" onClick={closeAuthModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Auth closeAuthModal={closeAuthModal} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Header;

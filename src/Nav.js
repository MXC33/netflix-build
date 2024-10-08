import React, { useState, useEffect } from "react";
import "./Nav.css";
import { useNavigate } from "react-router-dom";

function Nav() {
  const [show, handleShow] = useState(false);
  const navigate = useNavigate();

  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);

  return (
    <div className={`nav ${show && "nav_black"}`}>
      <div className="nav_contents">
        <img
          onClick={() => navigate("/")}
          className="nav_logo"
          src="https://loodibee.com/wp-content/uploads/Netflix-logo.png"
          alt=""
        />

        <img
          onClick={() => navigate("/profile")}
          className="nav_avatar"
          src="https://i.pinimg.com/474x/61/54/76/61547625e01d8daf941aae3ffb37f653.jpg"
          alt=""
        />
      </div>
    </div>
  );
}

export default Nav;

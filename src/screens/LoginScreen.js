import React from "react";
import "./LoginScreen.css";

function LoginScreen() {
  return (
    <div className="loginScreen">
      <div className="loginScreen_background">
        <img
          className="loginScreen_logo"
          src="https://loodibee.com/wp-content/uploads/Netflix-logo.png"
          alt=""
        />
        <button className="loginScreen_button">sign in</button>
        <div className="loginScreen_gradient" />
      </div>

      <div className="loginScreen_body">
        <>
          <h1> Unlimited films, TV programmes and more.</h1>
          <h2>Watch anywhere. Cancel at any time.</h2>
          <h3>
            Ready to watch? enter your email to create or restart your
            membership.
          </h3>

          <div className="loginScreen_input">
            <form>
              <input type="email" placeholder="Email Adress" />
              <button className="loginScreen_getStarted">GET STARTED</button>
            </form>
          </div>
        </>
      </div>
    </div>
  );
}

export default LoginScreen;

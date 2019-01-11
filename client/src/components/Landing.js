//first page of project not root element
import React, { Component } from "react";
import Unicoins from "../assets/Unicoins.png";

class Landing extends Component {
  render() {
    return (
      <div className="landing">
        //{" "}
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              //{" "}
              <div className="second col-md-12 text-center">
                <img src={Unicoins} alt="Logo" />;
                <hr />
                <a href="register.html" className="btn btn-lg btn-info mr-2">
                  Sign Up
                </a>
                <a href="login.html" className="btn btn-lg btn-light">
                  Login
                </a>
              </div>
            </div>
            //{" "}
          </div>
          //{" "}
        </div>
      </div>
    );
  }
}

export default Landing;

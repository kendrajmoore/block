//first page of project not root element
import React, { Component } from "react";
import Unicoins from "../assets/Unicoins.png";
<<<<<<< HEAD
import pink from "../assets/pink.png";
=======
>>>>>>> ea9d30e15229dd8cfdabf8d5b9cadc59fcc6f8f7

class Landing extends Component {
  render() {
    return (
      <div className="landing">
        //{" "}
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              //{" "}
<<<<<<< HEAD
              <div className="col-md-12 text-center">
                <img src={pink} alt="Logo" />;
=======
              <div className="second col-md-12 text-center">
                <img src={Unicoins} alt="Logo" />;
>>>>>>> ea9d30e15229dd8cfdabf8d5b9cadc59fcc6f8f7
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

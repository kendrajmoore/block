//first page of project not root element
import React, { Component } from "react";
import pink from "../assets/pink.png";

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
                <img className="first-page" src={pink} alt="Logo" />;
                <hr />
              </div>
            </div>
            //{" "}
          </div>
          //{" "}
        </div>
        <div className="landing-footer" />
      </div>
    );
  }
}

export default Landing;

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles.css";

import { LogoWorld } from "./logo-world";

import "bootstrap/dist/css/bootstrap.min.css";

var init = {
  method: "GET",
  mode: "cors"
};

export default function App() {
  return (
    <div className="App">
      <Router>
        <LogoWorld />
      </Router>
    </div>
  );
}

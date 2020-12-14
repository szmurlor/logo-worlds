import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./styles.css";

import { LogoWorld } from "./logo-world";
import { Login } from "./login";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Login} />
        <Route path="/graj" component={LogoWorld} />
      </Router>
    </div>
  );
}

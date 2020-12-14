import React, {useState} from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./styles.css";

import { LogoWorld } from "./logo-world";
import { Login } from "./login";

import appState from "./appstate"

export default function App() {
  var [v,setV] = useState(0);
  appState.updateApp = () => {
    console.log("updateApp?")
    setV(v+1);
  };
  console.log("Przerysowuje app...");
  return (
    <div className="App">
      <Router>
        {
          appState.state.token === null ?
            <Login />
          :
            <LogoWorld />
        }
      </Router>
    </div>
  );
}

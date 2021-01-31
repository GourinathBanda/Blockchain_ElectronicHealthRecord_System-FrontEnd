import React from "react";
import ReactDOM from "react-dom";
import Main from "./pages/main.js";
import View from "./pages/view.js";
// import Login from "./pages/login.js";
import { BrowserRouter as Router, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route exact path="/">
        <Main />
      </Route>
      <Route exact path="/view">
        <View />
      </Route>
      {/* <Route exact path="/login">
        {Login}
      </Route> */}
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

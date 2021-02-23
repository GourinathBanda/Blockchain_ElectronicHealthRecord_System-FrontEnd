import React from "react";
import ReactDOM from "react-dom";
import Main from "./pages/main.js";
import View from "./pages/view.js";
import Add from "./pages/add.js";
import Profile from "./pages/profile.js";
import Register from "./pages/register.js";
import NotAuth from "./pages/notauth.js";
import Login from "./pages/login.js";
import SmartContract from "./pages/smartcontract.js";
import AuthWrapper from "./components/AuthWrapper";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route } from "react-router-dom";
import theme from "./theme";
import { roles } from "./helpers/roles";
import { PrivateRoute } from "./components/PrivateRoute";
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AuthWrapper>
          <Router>
            <PrivateRoute
              exact
              path="/"
              component={Main}
              roles={[roles.PATIENT, roles.HOSPITAL, roles.INSURER]}
            />
            <PrivateRoute
              exact
              path="/view"
              component={View}
              roles={[roles.PATIENT, roles.HOSPITAL, roles.INSURER]}
            />
            <PrivateRoute
              exact
              path="/add"
              component={Add}
              roles={[roles.HOSPITAL]}
            />
            <PrivateRoute
              exact
              path="/profile"
              component={Profile}
              roles={[roles.PATIENT, roles.HOSPITAL, roles.INSURER]}
            />
            <PrivateRoute
              exact
              path="/smartcontract"
              component={SmartContract}
              roles={[roles.PATIENT, roles.HOSPITAL, roles.INSURER]}
            />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/notauth" component={NotAuth} />
          </Router>
        </AuthWrapper>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

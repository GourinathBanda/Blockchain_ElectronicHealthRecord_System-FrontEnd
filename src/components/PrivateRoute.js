import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (localStorage.getItem("usertoken")) {
        // if (roles && roles.indexOf(currentUser.role) === -1) {
        //   return <Redirect to={{ pathname: "/notauth" }} />;
        // }
        return <Component {...props} />;
      }
      return (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      );
    }}
  />
);

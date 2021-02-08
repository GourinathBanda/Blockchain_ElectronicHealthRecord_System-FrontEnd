import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const privateRoute = ({ component: Component, roles, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (localStorage.getItem("usertoken")) {
        if (roles && auth.user && roles.indexOf(auth.user.roll) === -1) {
          return <Redirect to={{ pathname: "/notauth" }} />;
        }
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

export const PrivateRoute = connect(mapStateToProps, null, null, {
  pure: false,
})(privateRoute);

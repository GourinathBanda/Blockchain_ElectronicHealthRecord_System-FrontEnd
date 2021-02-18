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
      if (!localStorage.getItem("ud")) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }
      const st = localStorage.getItem("ud");
      const ud = JSON.parse(st);
      if (roles && roles.indexOf(ud.role) === -1) {
        return <Redirect to={{ pathname: "/notauth" }} />;
      }
      return <Component {...props} />;
    }}
  />
);

export const PrivateRoute = connect(mapStateToProps, null, null, {
  pure: false,
})(privateRoute);

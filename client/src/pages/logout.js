import React, { useEffect } from "react";
import { connect } from "react-redux";
import { logout } from "../redux/actionCreators/auth";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

const Logout = (props) => {
  useEffect(() => {
    props.logout();
  }, []);
  return <div>Logging out...</div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { autoLogin } from "../redux/actionCreators/auth";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  autoLogin: () => dispatch(autoLogin()),
});

const AuthWrapper = (props) => {
  useEffect(() => {
    props.autoLogin();
  }, [props.auth]);

  return <>{props.children}</>;
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthWrapper);

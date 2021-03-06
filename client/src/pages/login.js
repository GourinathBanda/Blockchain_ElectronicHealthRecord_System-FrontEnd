import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login, autoLogin } from "../redux/actionCreators/auth";
import Appbar from '../components/Appbar'

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  login: (username, password) => dispatch(login(username, password)),
  autoLogin: () => dispatch(autoLogin()),
});

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { autoLogin } = props;

  const requestLogin = (e) => {
    e.preventDefault();
    props.login(username, password);
  };

  useEffect(() => {
    autoLogin();
  }, []);

  const { loggingIn, loggedIn, errMess } = props.auth;
  console.log(props.auth);
  if (loggedIn && props.auth.user && props.auth.user.scAccountAddress)
    return <Redirect to="/" />;
  if (loggedIn && props.auth.user && !props.auth.user.scAccountAddress)
    return <Redirect to="/smartcontract" />;

  return (
    <div>
      <Appbar />
      <Container maxWidth="xs" style={{ marginTop: "200px" }}>
        <Paper style={{ padding: "20px" }}>
          <Typography margin="normal" style={{ marginTop: "8px" }}>
            Login
          </Typography>
          <TextField
            id="user"
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="password"
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            required
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={requestLogin}
          >
            Login
          </Button>
          <Button
            style={{ marginTop: "16px" }}
            variant="outlined"
            fullWidth
            color="primary"
            href="/register"
          >
            Register
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

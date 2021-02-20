import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { register, registerClear } from "../redux/actionCreators/register";
import { deploy } from "../helpers/contractDeploy";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { roles } from "../helpers/roles";
import faker from "faker";
import Web3 from "web3";

const availableRoles = [roles.PATIENT, roles.HOSPITAL, roles.INSURER];

const mapStateToProps = (state) => ({
  auth: state.auth,
  registeration: state.register,
});

const mapDispatchToProps = (dispatch) => ({
  register: (user) => dispatch(register(user)),
  registerClear: (user) => dispatch(registerClear(user)),
});

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        role: "",
      },
      userError: "",
      passError: "",
      emailError: "",
      snackBarOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.runfaker = this.runfaker.bind(this);
  }

  async componentDidMount() {
    if (this.props.registeration.registerd) {
      this.handleRegNotification(true);
      this.props.registerClear();
    }

    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else {
      window.alert("Please link Metamask to avoid any errors.")
    }
  }

  handleRegNotification = (status) => {
    this.setState({ snackBarOpen: status });
  };

  handleRegNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.handleRegNotification(false);
  };

  validateForm() {
    var valid = true;
    if (this.state.user.username.includes("!")) {
      this.setState({ userError: "Username cant include - !" });
      valid = false;
    }
    if (this.state.user.password.includes("@")) {
      this.setState({ passError: "Not a valid password." });
      valid = false;
    }
    if (!this.state.user.email.includes("@")) {
      this.setState({ emailError: "Not a valid email." });
      valid = false;
    }
    return valid;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.props.register(this.state.user);
      deploy();
    }
  }

  handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    const { user } = this.state;
    this.setState({
      user: { ...user, [name]: value },
    });
  }

  runfaker(e) {
    e.preventDefault();
    const name = faker.name.firstName();
    const fakeUser = {
      firstName: name,
      lastName: name,
      username: name,
      email: name + "@" + name + ".com",
      password: name,
      role: roles.HOSPITAL,
    };

    this.setState({
      user: fakeUser,
    });
  }

  render() {
    if (this.props.auth.loggedIn && this.props.auth.user)
      return <Redirect to="/" />;

    const { registering, registerd, errMess } = this.props.registeration;

    return (
      <>
        <Container maxWidth="xs" style={{ marginTop: "20px" }}>
          <Paper style={{ padding: "20px" }}>
            <Typography margin="normal" style={{ marginTop: "8px" }}>
              Register
            </Typography>
            {registerd ? (
              <Typography>Registration successfull! Please login</Typography>
            ) : null}

            {errMess}

            <TextField
              name="username"
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              required
              value={this.state.user.username}
              onChange={(e) => {
                this.handleChange(e);
              }}
            />
            <TextField
              name="firstName"
              fullWidth
              label="First Name"
              variant="outlined"
              margin="normal"
              required
              value={this.state.user.firstName}
              onChange={(e) => {
                this.handleChange(e);
              }}
            />
            <TextField
              name="lastName"
              fullWidth
              label="Last Name"
              variant="outlined"
              margin="normal"
              required
              value={this.state.user.lastName}
              onChange={(e) => {
                this.handleChange(e);
              }}
            />
            <TextField
              name="email"
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              required
              type="email"
              value={this.state.user.email}
              onChange={(e) => {
                this.handleChange(e);
              }}
            />
            <TextField
              name="password"
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              required
              type="password"
              value={this.state.user.password}
              onChange={(e) => {
                this.handleChange(e);
              }}
            />
            {/* <TextField
            name="role"
            fullWidth
            variant="outlined"
            margin="normal"
            required
            type="checkbox"
            checked={this.state.user.role}
            onChange={(e) => {
              this.handleChange(e);
            }}
          /> */}
            <TextField
              name="role"
              fullWidth
              label="Select"
              variant="outlined"
              margin="normal"
              required
              select
              value={this.state.user.role}
              onChange={(e) => {
                this.handleChange(e);
              }}
              helperText="Please select your role"
            >
              {availableRoles.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant={registering ? "outlined" : "contained"}
              fullWidth
              color="primary"
              onClick={(e) => {
                this.handleSubmit(e);
              }}
            >
              {registering ? <CircularProgress /> : "Register"}
            </Button>
            <Button
              style={{ marginTop: "16px" }}
              variant="outlined"
              fullWidth
              color="primary"
              href="/login"
            >
              Login
            </Button>
            <Button
              style={{ marginTop: "16px" }}
              variant="outlined"
              fullWidth
              color="primary"
              onClick={this.runfaker}
            >
              FAKER
            </Button>
          </Paper>
        </Container>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={5000}
          onClose={this.handleRegNotification}
          // message={registerd ? "Registeration Successfull!" : errMess}
          message="Reg sucs"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={this.handleRegNotificationClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);

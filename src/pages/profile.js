import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { register, registerClear } from "../redux/actionCreators/register";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
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
import { getCurrentUser } from "../services/apiCalls";

const availableRoles = [roles.PATIENT, roles.HOSPITAL, roles.INSURER];

const mapStateToProps = (state) => ({
  auth: state.auth,
  registeration: state.register,
});

const mapDispatchToProps = (dispatch) => ({
  register: (user) => dispatch(register(user)),
  registerClear: (user) => dispatch(registerClear(user)),
});

export class Profile extends Component {
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
        aadhar: "",
        publicKey: "",
        scAccountAddress: "",
        phoneNo: "",
      },
      edit: false,
      userError: "",
      passError: "",
      emailError: "",
      snackBarOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.registeration.registerd) {
      this.handleRegNotification(true);
      this.props.registerClear();
    }

    this.getUser();
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

  async getUser() {
    const user = await getCurrentUser();
    this.setState({
      user: { ...user },
    });
  }

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

  render() {
    if (this.props.auth.loggedIn && this.props.auth.user)
      return <Redirect to="/" />;

    const { registering, registerd, errMess } = this.props.registeration;

    return (
      <>
        <Appbar />
        <Container maxWidth="md" style={{ marginTop: "70px" }}>
          <Paper style={{ padding: "20px" }}>
            <Typography margin="normal" style={{ marginTop: "8px" }}>
              My Profile
            </Typography>
            {registerd ? (
              <Typography>Registration successfull! Please login</Typography>
            ) : null}

            {errMess}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="username"
                  fullWidth
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  required
                  disabled={!this.state.edit}
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
                  disabled={!this.state.edit}
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
                  disabled={!this.state.edit}
                  value={this.state.user.lastName}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
                <TextField
                  name="phoneNo"
                  fullWidth
                  label="Phone No."
                  variant="outlined"
                  margin="normal"
                  disabled={!this.state.edit}
                  type="number"
                  value={this.state.user.phoneNo}
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
                  disabled={!this.state.edit}
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
                  disabled={!this.state.edit}
                  type="password"
                  value={this.state.user.password}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="role"
                  fullWidth
                  label="Select"
                  variant="outlined"
                  margin="normal"
                  required
                  disabled={!this.state.edit}
                  select
                  value={this.state.user.role}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                >
                  {availableRoles.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="aadhar"
                  fullWidth
                  label="Aadhar"
                  variant="outlined"
                  margin="normal"
                  disabled={!this.state.edit}
                  type="number"
                  value={this.state.user.aadhar}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
                <TextField
                  name="publicKey"
                  fullWidth
                  label="RSA Public Key"
                  variant="outlined"
                  margin="normal"
                  disabled={!this.state.edit}
                  type="text"
                  value={this.state.user.publicKey}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />

                <TextField
                  name="smAccountAddress"
                  fullWidth
                  label="Blockchain Address"
                  variant="outlined"
                  margin="normal"
                  disabled={!this.state.edit}
                  type="text"
                  value={this.state.user.smAccountAddress}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              style={{ marginTop: "16px" }}
              variant="outlined"
              fullWidth
              color="primary"
              href="/login"
            >
              Edit
            </Button>
            <Button
              variant={registering ? "outlined" : "contained"}
              fullWidth
              color="primary"
              onClick={(e) => {
                this.handleSubmit(e);
              }}
            >
              {registering ? <CircularProgress /> : "Go back"}
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

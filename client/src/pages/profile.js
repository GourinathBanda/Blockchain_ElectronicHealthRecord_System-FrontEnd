import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { updateCurrentUser } from "../services/apiCalls";
import { getCurrentUser } from "../services/apiCalls";
import { roles } from "../helpers/roles";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const availableRoles = [roles.PATIENT, roles.HOSPITAL, roles.INSURER];

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        role: "",
        aadhar: "",
        encryptionKey: "",
        scAccountAddress: "",
        phoneNo: "",
      },
      edit: false,
      errors: "",
      snackBarOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  async getUser() {
    const user = await getCurrentUser();
    console.log("user", user);
    this.setState({
      user: { ...user },
    });
  }

  validateForm() {
    var valid = true;
    if (!this.state.user.email.includes("@")) {
      this.setState({ errors: "Not a valid email" });
      valid = false;
    }
    if (this.state.user.phoneNo.toString().length !== 10) {
      this.setState({ errors: "Invalid Phone Number" });
      valid = false;
    }
    return valid;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.edit) {
      this.setState({ edit: true });
    } else if (this.state.edit && this.validateForm()) {
      this.setState({ edit: false });
      updateCurrentUser(this.state.user);
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
    // if (!this.props.auth.loggedIn || !this.props.auth.user)
    //   return <Redirect to="/" />;

    return (
      <>
        <Appbar />
        <Container maxWidth="md" style={{ marginTop: "70px" }}>
          <Paper style={{ padding: "20px" }}>
            {this.state.errors}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="username"
                  fullWidth
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  required
                  disabled
                  value={this.state.user.username}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
                <TextField
                  name="firstname"
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  margin="normal"
                  required
                  disabled={!this.state.edit}
                  value={this.state.user.firstname}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
                <TextField
                  name="lastname"
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  margin="normal"
                  required
                  disabled={!this.state.edit}
                  value={this.state.user.lastname}
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
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="role"
                  fullWidth
                  label="Select"
                  variant="outlined"
                  margin="normal"
                  required
                  disabled
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
                  label={this.state.user.role === roles.HOSPITAL ? 'Medical Reg. Number' : (this.state.user.role === roles.PATIENT ? "Aadhar" : "Insurer ID")}
                  variant="outlined"
                  margin="normal"
                  disabled
                  type="number"
                  value={this.state.user.aadhar}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
                <TextField
                  name="encryptionKey"
                  fullWidth
                  label="RSA Public Key"
                  variant="outlined"
                  margin="normal"
                  disabled
                  type="text"
                  value={this.state.user.encryptionKey}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />

                <TextField
                  name="scAccountAddress"
                  fullWidth
                  label="Blockchain Address"
                  variant="outlined"
                  margin="normal"
                  disabled
                  type="text"
                  value={this.state.user.scAccountAddress}
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
                  disabled
                  type="password"
                  value={this.state.user.password}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              style={{ marginTop: "16px", marginBottom: "16px" }}
              variant={!this.state.edit ? "outlined" : "contained"}
              fullWidth
              color="primary"
              onClick={(e) => {
                this.handleSubmit(e);
              }}
            >
              {this.state.edit ? "Save" : "Edit"}
            </Button>

            {this.state.edit ? (
              <Button
                variant="outlined"
                fullWidth
                color="primary"
                onClick={() => {
                  this.setState({ edit: false });
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button variant="contained" fullWidth color="primary" href="/">
                Go Back
              </Button>
            )}
          </Paper>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps)(Profile);

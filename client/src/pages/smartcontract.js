import React, { useState, useEffect } from "react";
import { deploy } from "../services/contractCalls";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { updateCurrentUser } from "../services/apiCalls";
import Web3 from "web3";
import { autoLogin } from "../redux/actionCreators/auth";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  autoLogin: () => dispatch(autoLogin()),
});

const SmartContract = (props) => {
  const [deployed, setDeployed] = useState(false);

  useEffect(() => {
    console.log(props.auth.user);
    if (props.auth.user && props.auth.user.scAccountAddress) {
      setDeployed(true);
    }
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    } else {
      window.alert("Please link Metamask to avoid any errors.");
    }
  }, [props.auth]);

  const createContract = async () => {
    const address = await deploy();
    console.log("address", address);
    const response = await updateCurrentUser({
      scAccountAddress: address,
    });
    if (response === "SUCCESSFUL") {
      //TODO show snackbar
      setDeployed(true);
      props.autoLogin();
    }
    console.log("response", response);
  };

  return (
    <>
      <Appbar />
      <Container maxWidth="xs" style={{ marginTop: "200px" }}>
        {deployed === false && (
          <>
            <Typography>Please create medical record account</Typography>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              style={{ marginBottom: "8px" }}
              onClick={createContract}
            >
              Create
            </Button>
          </>
        )}
        {deployed === true && (
          <Typography>
            You have successfully created a medical record account
          </Typography>
        )}
      </Container>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SmartContract);

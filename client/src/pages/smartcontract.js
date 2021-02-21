import React, { useEffect } from "react";
import { deploy } from "../services/contractCalls";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { updateCurrentUser } from "../services/apiCalls";
import Web3 from "web3";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

// const mapDispatchToProps = (dispatch) => ({});

const SmartContract = (props) => {
  useEffect(() => {
    console.log("ef");
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    } else {
      window.alert("Please link Metamask to avoid any errors.");
    }
  }, []);

  const createContract = async () => {
    const address = await deploy();
    console.log("address", address);
    const response = await updateCurrentUser({
      scAccountAddress: address,
    });
    console.log("response", response);
  };

  return (
    <>
      <Appbar />
      <Container maxWidth="xs" style={{ marginTop: "200px" }}>
        <Typography>Please create a Smart Contract to continue</Typography>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          style={{ marginBottom: "8px" }}
          onClick={createContract}
        >
          Create Smart Contract
        </Button>
      </Container>
    </>
  );
};

export default connect(mapStateToProps)(SmartContract);

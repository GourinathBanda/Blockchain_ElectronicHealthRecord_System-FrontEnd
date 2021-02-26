import React, { useState, useEffect } from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { deploy } from "../services/contractCalls";
import { fetchSalt, updateCurrentUser } from "../services/apiCalls";
import { autoLogin } from "../redux/actionCreators/auth";
import { roles } from "../helpers/roles";

import Web3 from "web3";
import cryptico from "cryptico";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  autoLogin: () => dispatch(autoLogin()),
});

const SmartContract = (props) => {
  const [SCdeployed, setSCDeployed] = useState(false);
  const [RSAKeysGenerated, setRSAKeysGenerated] = useState(false);
  const [passPhrase, setPassPhrase] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log(props.auth.user);
    if (props.auth.user && props.auth.user.scAccountAddress) {
      setSCDeployed(true);
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
      setSCDeployed(true);
      props.autoLogin();
    }
    console.log("response", response);
  };

  const generateRSAKeys = async () => {
    if (passPhrase.length > 20) {
      // const salt = await fetchSalt();
      // const actualPassPhrase = passPhrase + salt + password;
      const actualPassPhrase = passPhrase + password;
      const RSAKey = cryptico.generateRSAKey(actualPassPhrase, 1024);
      const publicKey = cryptico.publicKeyString(RSAKey);
      console.log("publicKey", publicKey);
      const response = await updateCurrentUser({ publicKey: publicKey });
      console.log(response);
      if (response) setRSAKeysGenerated(true);
    }
  };

  return (
    <>
      <Appbar />
      <Container maxWidth="xs" style={{ marginTop: "200px" }}>
        {props.auth.user &&
          props.auth.user.role === roles.PATIENT &&
          !SCdeployed &&
          !RSAKeysGenerated && (
            <Typography>Please complete the following process:</Typography>
          )}
        {SCdeployed === false && (
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
        {SCdeployed === true && (
          <Typography>
            You have successfully created a medical record account
          </Typography>
        )}
        <hr />
        {RSAKeysGenerated && (
          <>
            <Typography>
              Please note down the pass phrase. Your public key has been
              generated
            </Typography>
          </>
        )}
        {!RSAKeysGenerated && (
          <>
            <TextField
              name="passPhrase"
              fullWidth
              label="Pass phrase"
              variant="outlined"
              margin="normal"
              helperText="This phrase will be used to generate RSA Key. Please note it down."
              required
              value={passPhrase}
              onChange={(e) => {
                setPassPhrase(e.target.value);
              }}
            />
            <TextField
              name="password"
              type="password"
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              style={{ marginBottom: "8px" }}
              onClick={generateRSAKeys}
            >
              Gererate RSA Keys
            </Button>
          </>
        )}
      </Container>
    </>
  );
};

// ! http://www.tyro.github.io/cryptico/

export default connect(mapStateToProps, mapDispatchToProps)(SmartContract);

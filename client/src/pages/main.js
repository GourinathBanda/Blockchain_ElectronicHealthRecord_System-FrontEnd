import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { getBasicUserDetails } from "../services/apiCalls";
import DialogBox from "../components/Dialog";
import Web3 from "web3";
import { roles } from "../helpers/roles";
import cryptico from "cryptico";
import {
  askReadPermission,
  checkReader,
  viewLocationHash,
  grantWritePermission,
  grantReadPermission,
  askWritePermission,
  checkWriter,
} from "../services/contractCalls";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

// const mapDispatchToProps = (dispatch) => ({});
function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  } else {
    window.alert("Please link Metamask to avoid any errors.");
  }
}

const Main = (props) => {
  useEffect(() => {
    loadWeb3();
  }, []);

  const history = useHistory();
  const [patientID, setPatientID] = useState("");
  const [textInput, setTextInput] = useState("");
  const [openDialogView, setOpenDialogView] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogGrantWrite, setOpenDialogGrantWrite] = useState(false);
  const [openDialogGrantView, setOpenDialogGrantView] = useState(false);
  const [foundDetails, setFoundDetails] = useState(null);
  const [patientPassPhrase, setPatientPassPhrase] = useState("");

  const buttonsView = [
    {
      onClick: () => handleAskViewPermission(),
      text: "Okay",
    },
    {
      onClick: () => setOpenDialogView(false),
      text: "Cancel",
    },
  ];

  const buttonsAdd = [
    {
      onClick: () => handleAskAddPermission(),
      text: "Okay",
    },
    {
      onClick: () => setOpenDialogAdd(false),
      text: "Cancel",
    },
  ];

  const buttonsGrantWrite = [
    {
      onClick: () => handleGrantWritePermission(),
      text: "Okay",
    },
    {
      onClick: () => setOpenDialogGrantWrite(false),
      text: "Cancel",
    },
  ];

  const buttonsGrantView = [
    {
      onClick: () => handleGrantViewPermission(),
      text: "Okay",
    },
    {
      onClick: () => setOpenDialogGrantView(false),
      text: "Cancel",
    },
  ];

  const handleNoRecord = (e) => {
    e.preventDefault();
    setFoundDetails(null);
    setPatientID("");
  };

  const handleViewMyRecords = () => { };

  const handleSearchUser = async (id) => {
    setPatientID(textInput);
    const details = await getBasicUserDetails(textInput);
    if (details !== undefined) {
      setFoundDetails(details);
    }
  };

  const handleView = () => {
    const permission = false; //fetch from server
    if (!permission) {
      setOpenDialogView(true);
    } else {
      navigateToView();
    }
  };

  const handleAdd = () => {
    const permission = false; //fetch from server
    if (!permission) {
      setOpenDialogAdd(true);
    } else {
      navigateToAdd();
    }
  };

  const handleGrantWrite = () => {
    setOpenDialogGrantWrite(true);
  };

  const handleGrantView = () => {
    setOpenDialogGrantView(true);
  };

  const handleAskViewPermission = async () => {
    setOpenDialogView(false);
    const accountsAvailable = await window.web3.eth.getAccounts();
    const address = foundDetails.scAccountAddress;

    const res = await checkReader(address, accountsAvailable[0]);
    if (res.length !== 0) {
      return navigateToView();
    }

    const response = await askReadPermission(accountsAvailable[0], address);
    console.log("response", response);

    // const res = await checkReader(address, accountsAvailable[0]);
    // console.log("result", res);
    // console.log('length', res.length);

    setInterval(async () => {
      const res = await checkReader(address, accountsAvailable[0]);
      if (res.length !== 0) {
        navigateToView();
      }
    }, 5000);
  };

  const handleAskAddPermission = async () => {
    setOpenDialogAdd(false);
    const accountsAvailable = await window.web3.eth.getAccounts();
    const address = foundDetails.scAccountAddress;

    const res = await checkWriter(address, accountsAvailable[0]);
    if (res === true) {
      return navigateToAdd();
    }

    const response = await askWritePermission(accountsAvailable[0], address);
    console.log("response", response);

    setInterval(async () => {
      const res = await checkWriter(address, accountsAvailable[0]);
      if (res === true) {
        navigateToAdd();
      }
    }, 5000);
  };

  const handleGrantWritePermission = async () => {
    setOpenDialogGrantWrite(false);

    const accountsAvailable = await window.web3.eth.getAccounts();
    const address = props.auth.user.scAccountAddress;
    const response = await grantWritePermission(accountsAvailable[0], address);
    // console.log("response", response);
    console.log(response);
  };

  const handleGrantViewPermission = async () => {
    setOpenDialogGrantView(false);

    const accountsAvailable = await window.ethereum.request({
      method: "eth_accounts",
    });
    // Uncomment code to set up encryption functionality.

    // ! fetch from server
    // const hospitalEncryptionKey = "sdf";
    const address = props.auth.user.scAccountAddress;
    // const patientPrivateKey = cryptico.generateRSAKey(patientPassPhrase, 1024);
    const hash = await viewLocationHash(accountsAvailable[0], address);
    // const decryptedHash = cryptico.decrypt(hash, patientPrivateKey);
    // const newEncryptedHash = cryptico.encrypt(
    //   decryptedHash,
    //   hospitalEncryptionKey
    // );
    // console.log("hash", newEncryptedHash);
    const response = await grantReadPermission(
      accountsAvailable[0],
      address,
      // newEncryptedHash
      hash
    );
    // console.log("response", response);
    console.log(response);
  };

  const navigateToView = () => {
    history.push({
      pathname: "/view",
      patientID: patientID,
      data: foundDetails,
    });
  };

  const navigateToAdd = () => {
    history.push({
      pathname: "/add",
      patientID: patientID,
      data: foundDetails,
    });
  };

  // console.log("sdf", foundDetails);
  return (
    <>
      <Appbar />
      <Container maxWidth="xs" style={{ marginTop: "200px" }}>
        {patientID === "" && (
          <div className="findPatient">
            <Typography margin="normal" style={{ marginTop: "8px" }}>
              Please enter patient's username
            </Typography>
            <TextField
              id="patientID"
              fullWidth
              label="Patient ID"
              variant="outlined"
              margin="normal"
              required
              onChange={(e) => setTextInput(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={handleSearchUser}
            >
              Search
            </Button>
            <hr />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={(e) => handleViewMyRecords(textInput)}
            >
              View My Records
            </Button>
          </div>
        )}
        {patientID !== "" &&
          foundDetails &&
          foundDetails.scAccountAddress !== "" && (
            <div className="ViewAdd">
              <Typography>
                Patient Record Exists
                <br /> Username: {patientID}
              </Typography>
              <Typography>
                {foundDetails.firstname + " " + foundDetails.lastname}
              </Typography>
              {props.auth.user && props.auth.user.role === roles.HOSPITAL && (
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  // href="/view"
                  onClick={handleView}
                  style={{ marginBottom: "8px" }}
                >
                  View
                </Button>
              )}
              {props.auth.user && props.auth.user.role === roles.HOSPITAL && (
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  // href="/add"
                  onClick={handleAdd}
                >
                  Add
                </Button>
              )}
              <hr />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                style={{ marginBottom: "8px" }}
                onClick={handleNoRecord}
              >
                Cancel
              </Button>
            </div>
          )}

        {((!foundDetails && patientID !== "") ||
          (foundDetails && foundDetails.scAccountAddress === "")) && (
            <div>
              <Typography>No record exists for patient ID:{patientID}</Typography>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                style={{ marginBottom: "8px" }}
                onClick={handleNoRecord}
              >
                Okay
            </Button>
            </div>
          )}
        {props.auth.user && props.auth.user.role === roles.PATIENT && (
          <Button
            variant="contained"
            fullWidth
            color="primary"
            style={{ marginBottom: "8px", marginTop: "8px" }}
            onClick={handleGrantWrite}
          >
            Grant Write Permission
          </Button>
        )}

        {props.auth.user && props.auth.user.role === roles.PATIENT && (
          <Button
            variant="contained"
            fullWidth
            color="primary"
            style={{ marginBottom: "8px" }}
            onClick={handleGrantView}
          >
            Grant View Permission
          </Button>
        )}
      </Container>
      {foundDetails && (
        <DialogBox
          // onClose={handleOnDialogClose}
          text={
            "Asking user " +
            foundDetails.firstname +
            " " +
            foundDetails.lastname +
            " for read permission"
          }
          title="Read Permission"
          open={openDialogView}
          buttons={buttonsView}
        />
      )}
      {foundDetails && (
        <DialogBox
          // onClose={handleOnDialogClose}
          text={
            "Asking user " +
            foundDetails.firstname +
            " " +
            foundDetails.lastname +
            " for write permission"
          }
          title="Write Permission"
          open={openDialogAdd}
          buttons={buttonsAdd}
        />
      )}
      <DialogBox
        // onClose={handleOnDialogClose}
        text="Grant hospital abc for write permission"
        title="Write Permission"
        open={openDialogGrantWrite}
        buttons={buttonsGrantWrite}
      />
      <DialogBox
        // onClose={handleOnDialogClose}
        text="Grant hospital abc for view permission"
        title="Read Permission"
        open={openDialogGrantView}
        buttons={buttonsGrantView}
      >
        <TextField
          name="patientPassPhrase"
          fullWidth
          label="Your Passphrase"
          variant="outlined"
          margin="normal"
          required
          value={patientPassPhrase}
          onChange={(e) => {
            setPatientPassPhrase(e.target.value);
          }}
        />
      </DialogBox>
    </>
  );
};

export default connect(mapStateToProps)(Main);

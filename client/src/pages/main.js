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
import { askReadPermission } from "../services/contractCalls";
import { askWritePermission } from "../services/contractCalls";
import { roles } from "../helpers/roles";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

// const mapDispatchToProps = (dispatch) => ({});

const Main = (props) => {
  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else {
        window.alert("Please link Metamask to avoid any errors.");
      }
    }
    loadWeb3();
  }, []);

  const history = useHistory();
  const [patientID, setPatientID] = useState("");
  const [textInput, setTextInput] = useState("");
  const [openDialogView, setOpenDialogView] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [foundDetails, setFoundDetails] = useState(null);

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

  const handleNoRecord = (e) => {
    e.preventDefault();
    setFoundDetails(null);
    setPatientID("");
  };

  const handleViewMyRecords = () => {};

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

  const handleAskViewPermission = async () => {
    setOpenDialogView(false);
    // ! check if has view permission
    var permission = false; // ! fetch from server
    // send ask permission to server
    const accountsAvailable = await window.web3.eth.getAccounts();
    const address = foundDetails.scAccountAddress;
    const response = await askReadPermission(accountsAvailable[0], address);
    console.log("response", response);
    permission = response.status;
    if (permission) {
      navigateToView();
    }
  };

  const handleAskAddPermission = async () => {
    setOpenDialogAdd(false);
    // ! check if has view permission
    var permission = false; // ! fetch from server
    // send ask permission to server
    const accountsAvailable = await window.web3.eth.getAccounts();
    const address = foundDetails.scAccountAddress;
    const response = await askWritePermission(accountsAvailable[0], address);
    console.log("response", response);
    permission = response.status;
    if (permission) {
      navigateToAdd();
    }
  };

  const navigateToView = () => {
    history.push({
      pathname: "/view",
      patientID: patientID,
    });
  };

  const navigateToAdd = () => {
    history.push({
      pathname: "/add",
      patientID: patientID,
    });
  };

  console.log("sdf", foundDetails);
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
      </Container>
      <DialogBox
        // onClose={handleOnDialogClose}
        text="Asking user abc for read permission"
        title="Read Permission"
        open={openDialogView}
        buttons={buttonsView}
      />
      <DialogBox
        // onClose={handleOnDialogClose}
        text="Asking user abc for read permission"
        title="Read Permission"
        open={openDialogAdd}
        buttons={buttonsAdd}
      />
    </>
  );
};

export default connect(mapStateToProps)(Main);

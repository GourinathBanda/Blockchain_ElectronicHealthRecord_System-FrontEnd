import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { checkUserExists } from "../services/apiCalls";
import DialogBox from "../components/Dialog";
import Web3 from "web3";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

// const mapDispatchToProps = (dispatch) => ({});

const Main = (props) => {

  useEffect(() => {
    async function loadWeb3() {
      if(window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      } else {
        window.alert("Please link Metamask to avoid any errors.")
      }
    }
    loadWeb3();
  }, [])

  const history = useHistory();
  const [patientID, setPatientID] = useState("");
  const [recordFound, setRecordFound] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const buttons = [
    {
      onClick: () => askViewPermission(),
      text: "Okay",
    },
    {
      onClick: () => setOpenDialog(false),
      text: "Cancel",
    },
  ];

  const handleNoRecord = (e) => {
    e.preventDefault();
    setRecordFound(false);
    setPatientID("");
  };

  const handleViewMyRecords = () => {};

  const handleSearchUser = async (id) => {
    setPatientID(textInput);
    const exists = await checkUserExists(textInput);
    if (exists) setRecordFound(true);
  };

  const handleView = () => {
    const permission = false; //fetch from server
    if (!permission) {
      setOpenDialog(true);
    } else {
      navigateToView();
    }
  };

  const askViewPermission = () => {
    setOpenDialog(false);
    // send ask permission to server
    const permission = true; //fetch from server
    if (permission) {
      navigateToView();
    }
  };

  const navigateToView = () => {
    history.push({
      pathname: "/view",
      patientID: patientID,
    });
  };

  return (
    <>
      <Appbar />
      <Container maxWidth="xs" style={{ marginTop: "200px" }}>
        {patientID === "" && (
          <div className="findPatient">
            <Typography margin="normal" style={{ marginTop: "8px" }}>
              Please enter patient's ID - Aadhar/Public Key
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
        {patientID !== "" && recordFound === true && (
          <div className="ViewAdd">
            <Typography>
              Patient Record Exists
              <br /> ID: {patientID}
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
            <Button variant="contained" fullWidth color="primary" href="/add">
              Add
            </Button>
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

        {patientID !== "" && recordFound === false && (
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
        open={openDialog}
        buttons={buttons}
      />
    </>
  );
};

export default connect(mapStateToProps)(Main);

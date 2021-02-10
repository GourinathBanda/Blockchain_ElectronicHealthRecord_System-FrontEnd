import React, { useState } from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

// const mapDispatchToProps = (dispatch) => ({});

const Main = (props) => {
  const [patientID, setPatientID] = useState("");
  const [recordFound, setRecordFound] = useState(true);
  const [textInput, setTextInput] = useState("");

  const handleNoRecord = (e) => {
    e.preventDefault();
    setRecordFound(false);
    setPatientID("");
  };

  const handleViewMyRecords = () => {};
  const handleView = () => {
    askViewPermission();
    // show notification sent
  };

  const askViewPermission = () => {
    // send ask permission to server
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
              onClick={(e) => setPatientID(textInput)}
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
    </>
  );
};

export default connect(mapStateToProps)(Main);

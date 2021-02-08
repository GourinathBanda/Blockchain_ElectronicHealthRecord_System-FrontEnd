import React, { useState } from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const Main = (props) => {
  const [patientID, setPatientID] = useState("");
  const [textInput, setTextInput] = useState("");

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
              onChange={(e) => setTextInput(e)}
            />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={(e) => setPatientID(textInput)}
            >
              OK
            </Button>
          </div>
        )}
        {patientID !== "" && (
          <div className="ViewAdd">
            <Button
              variant="contained"
              fullWidth
              color="primary"
              href="/view"
              style={{ marginBottom: "8px" }}
            >
              View
            </Button>
            <Button variant="contained" fullWidth color="primary" href="/add">
              Add
            </Button>
          </div>
        )}
      </Container>
    </>
  );
};

export default Main;

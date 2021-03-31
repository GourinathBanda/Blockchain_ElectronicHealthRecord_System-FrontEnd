import React, { useState } from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import MedicalRecordCard from "../components/MedicalRecordCard";
import { handleReadRevoke, viewLocationHash } from "../services/contractCalls";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import cryptico from "cryptico";
import DialogBox from "../components/Dialog";
import CryptoJS from "crypto-js";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { roles } from "../helpers/roles";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

function View(props) {
  const [record, setRecord] = useState("");
  const [hospitalPassPhrase, setHospitalPassPhrase] = useState("");
  const [openDialogView, setOpenDialogView] = useState(true);
  const [masterFile, setMasterFile] = useState([]);

  const patientID = props.history.location.patientID;
  const patientDetails = props.history.location.data;

  const buttonsView = [
    {
      onClick: () => setOpenDialogView(false),
      text: "Okay",
    },
    {
      onClick: () => {
        setHospitalPassPhrase("");
        setOpenDialogView(false);
      },
      text: "Cancel",
    },
  ];

  const getData = async () => {
    const accountsAvailable = await window.ethereum.request({
      method: "eth_accounts",
    });

    //console.log(props.auth.user);

    if (props.auth.user.role === roles.PATIENT) {
      const address = props.auth.user.scAccountAddress;
      // console.log(props.auth.user);
      viewLocationHash(accountsAvailable[0], address).then(
        (response) => handleResponse(response)
      )
    }
    else {
      const username = props.auth.user.username;
      const address = patientDetails.scAccountAddress;
      handleReadRevoke(accountsAvailable[0], address, username).then(
        (response) => handleResponse(response)
      );
    }
  };

  const handleResponse = (response) => {
    if (!response) {
      return;
    }
    console.log("response", response);
    console.log()
    const hospitalPrivateKey = cryptico.generateRSAKey(
      hospitalPassPhrase + props.auth.user.username,
      1024
    );
    const decryptedDataHash = cryptico.decrypt(
      response,
      hospitalPrivateKey
    );
    console.log("decrypted hash", decryptedDataHash.plaintext);
    const url =
      "https://ipfs.infura.io/ipfs/" + decryptedDataHash.plaintext;
    fetch(url)
      .then((res) => res.text())
      .then((res2) => {
        const JSONMasterFile = JSON.parse(res2);
        setMasterFile(JSONMasterFile);
        console.log("Masterfile", JSONMasterFile);
        // console.log(JSONFile.toString(CryptoJS.enc.Utf8)
      });
  };

  const getMedicalRecord = async (hash) => {
    const url = "https://ipfs.infura.io/ipfs/" + hash;
    fetch(url)
      .then((res) => res.text())
      .then((res2) => {
        var bytes = CryptoJS.AES.decrypt(res2, props.auth.user.role === roles.PATIENT ? props.auth.user.aadhar : patientDetails.aadhar);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setRecord(data);
        console.log(data);
      });
  };

  // TODO: check for viewing permission, other navigate away
  // TODO: navigate away when patientID is not set
  const showTitle = "Viewing Patient: " + patientID;
  return (
    <>
      <Appbar showTitle={showTitle} />
      <Container maxWidth="md" style={{ marginTop: "68px" }}>
        {record === "" ? (
          <Button variant="contained" color="primary" component="span" onClick={getData} className="upbutton">
            View Files
          </Button>
        ) : (
          <Paper style={{ marginTop: "68px", padding: "16px" }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  name="patient"
                  fullWidth
                  label="Patient"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={props.auth.user.role === roles.PATIENT ? props.auth.user.username : patientDetails.firstname + " " + patientDetails.lastname}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="date"
                  fullWidth
                  label="Date/Time"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={record.date}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="age"
                  fullWidth
                  label="Age"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={record.age}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="sex"
                  fullWidth
                  label="Sex"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={record.sex}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="weight"
                  fullWidth
                  label="Weight"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={record.weight}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="temperature"
                  fullWidth
                  label="Temperature"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={record.temp}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="heartrate"
                  fullWidth
                  label="Heart Rate"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={record.heart}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="bp"
                  fullWidth
                  label="BP"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={record.bp}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="symptoms"
                  fullWidth
                  label="Symptoms"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={record.symptoms}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="diagnosis"
                  fullWidth
                  label="Diagnosis"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={record.diagnosis}
                />
              </Grid>
              {
                record.tests.map((option, index) => (
                  <Grid item xs={12} key={index}>
                    <TextField
                      name="test"
                      fullWidth
                      label={"Test " + index}
                      variant="outlined"
                      margin="normal"
                      disabled
                      value={option}
                    />
                  </Grid>
                ))
              }
              {
                record.medication.map((option, index) => (
                  <Grid item xs={12} key={index}>
                    <TextField
                      name="medication"
                      fullWidth
                      label={"Medication " + index + " (Medicine | Frequency | Days)"}
                      variant="outlined"
                      margin="normal"
                      disabled
                      value={option[0] + " | " + option[1] + " | " + option[2]}
                    />
                  </Grid>
                ))
              }
              {
                record.photos.map((option, index) => (
                  <Grid item xs={12} key={index}>
                    <embed src={option} height={option[5] === "i" ? "100%" : "700"} width="100%" />
                  </Grid>
                ))
              }
            </Grid>
          </Paper>
        )}
        {masterFile &&
          masterFile.map((file, index) => (
            <MedicalRecordCard
              name={file.hospital}
              date={file.date}
              key={index}
              onClickDownload={() => getMedicalRecord(file.hash)}
            />
          ))}
      </Container>

      <DialogBox
        // onClose={handleOnDialogClose}
        text="Please enter your passphrase"
        title="Decrypt Data"
        open={openDialogView}
        buttons={buttonsView}
      >
        <TextField
          name="hospitalPassPhrase"
          fullWidth
          label="Passphrase"
          variant="outlined"
          margin="normal"
          required
          value={hospitalPassPhrase}
          onChange={(e) => {
            setHospitalPassPhrase(e.target.value);
          }}
        />
      </DialogBox>
    </>
  );
}

export default connect(mapStateToProps)(View);

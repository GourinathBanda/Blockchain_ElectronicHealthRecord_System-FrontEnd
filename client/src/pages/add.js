import React, { useRef, useState } from "react";
import Appbar from "../components/Appbar";
// import SnackBar from "../components/SnackBar";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import DialogBox from "../components/Dialog";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/";
import LinearProgress from "@material-ui/core/LinearProgress";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { handleWrite, handleReadRevoke } from "../services/contractCalls";
import AES from "crypto-js/aes";
import cryptico from "cryptico";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: "68px",
    padding: "16px",
  },
}));

const mapStateToProps = (state) => ({
  auth: state.auth,
});

function Add(props) {
  const [file, setFile] = useState("");
  const [progress, setProgess] = useState(0); // progess bar
  const el = useRef(); // accesing input element
  const [uploading, setUploading] = useState(false);
  const [hospitalPassPhrase, setHospitalPassPhrase] = useState("");
  const [openDialogView, setOpenDialogView] = useState(true);
  const [openDialogMed, setOpenDialogMed] = useState(false);
  const [openDialogTest, setOpenDialogTest] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [medication, setMedication] = useState([]);
  const [test, setTest] = useState("");
  const [tests, setTests] = useState([]);
  const [medicine, setMedicine] = useState("");
  const [frequency, setFrequency] = useState("");
  const [days, setDays] = useState("");
  const [weight, setWeight] = useState(null);
  const [temp, setTemp] = useState(null);
  const [heart, setHeart] = useState(null);
  const [age, setAge] = useState(null);
  const [sex, setSex] = useState(null);
  const [bp, setBP] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [photos, setPhotos] = useState([]);
  // const [snackBarOpen, setSnackBarOpen] = useState(false);

  const patientID = props.history.location.patientID;
  const patientDetails = props.history.location.data;
  console.log("patientDetails", patientDetails);
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

  const buttonsMed = [
    {
      onClick: () => {
        if(medicine && frequency && days) setMedication([...medication, [medicine,frequency,days]]);
        setMedicine("");
        setFrequency("");
        setDays("");
        setOpenDialogMed(false);
      },
      text: "Okay",
    },
    {
      onClick: () => {
        setOpenDialogMed(false);
        setMedicine("");
        setFrequency("");
        setDays("");
      },
      text: "Cancel",
    },
  ];

  const buttonsTest = [
    {
      onClick: () => {
        setTests([...tests, test])
        setOpenDialogTest(false);
      },
      text: "Okay",
    },
    {
      onClick: () => {
        setOpenDialogTest(false);
      },
      text: "Cancel",
    },
  ];

  const handleChange = (e) => {
    console.log("Reading Image");
    setProgess(0);
    const files = e.target.files; // accessing file
    //const encryptedHash = cryptico.encrypt(receivedHash, patientDetails.encryptionKey);

    for(const file of files) {
      const reader = new window.FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPhotos([...photos, reader.result]);
      };
    }
  };

  const cancelFileUpload = (e) => {
    setProgess(0);
    // ! do something to cancel the progress
    setUploading(false);
  };

  const getMasterFile = async () => {
    const accountsAvailable = await window.ethereum.request({
      method: "eth_accounts",
    });
    const address = patientDetails.scAccountAddress;
    const username = props.auth.user.username;

    return handleReadRevoke(accountsAvailable[0], address, username).then(
      (response) => {
        console.log("response", response);

        if (!response) {
          return [];
        }
        const hospitalPrivateKey = cryptico.generateRSAKey(
          hospitalPassPhrase + props.auth.user.username,
          1024
        );
        const decryptedDataHash = cryptico.decrypt(
          response,
          hospitalPrivateKey
        );

        const url =
          "https://ipfs.infura.io/ipfs/" + decryptedDataHash.plaintext;
        return fetch(url)
          .then((res) => res.text())
          .then((res2) => {
            const JSONMasterFile = JSON.parse(res2);
            console.log("Current Masterfile", JSONMasterFile);
            return JSONMasterFile;
            // console.log(JSONFile.toString(CryptoJS.enc.Utf8)
          });
      }
    );
  };

  const uploadFile = async () => {
    setUploading(true);
    // const result = await ipfs.add(file);
    // const hash = result.path;
    // console.log("ipfs image hash ", hash);
    setPhotos([...photos, file]);
  };

  const submitRecord = async () => {
    let masterFile = await getMasterFile();
    let rec = {
      "date" : new Date().toLocaleString(),
      "symptoms" : symptoms,
      "diagnosis" : diagnosis,
      "medication" : medication,
      "photos" : photos,
      "tests" : tests,
      "weight" : weight,
      "temp" : temp,
      "heart" : heart,
      "bp" : bp,
      "age" : age,
      "sex" : sex
    };
    rec = AES.encrypt(JSON.stringify(rec), patientDetails.aadhar).toString();

    const result = await ipfs.add(rec);
    const hash = result.path;
    console.log("ipfs", hash);

    const newFile = {
      "date" : new Date().toLocaleDateString(),
      "hospital" : props.auth.user.username,
      "hash" : hash
    };

    masterFile.push(newFile);
    console.log("State masterFile", masterFile);
    const newMasterFile = JSON.stringify(masterFile);
    const result2 = await ipfs.add(newMasterFile);
    const masterFileHash = result2.path;
    console.log("new masterfilehash", masterFileHash);
    const encryptedMasterFileHash = cryptico.encrypt(
      masterFileHash,
      patientDetails.encryptionKey
    );
    console.log("encryptedMasterFileHash", encryptedMasterFileHash);
    saveOnSC(encryptedMasterFileHash.cipher);
  };

  const saveOnSC = async (encryptedHash) => {
    const accountsAvailable = await window.ethereum.request({
      method: "eth_accounts",
    });
    const address = patientDetails.scAccountAddress;
    const username = props.auth.user.username;
    const response = handleWrite(
      accountsAvailable[0],
      address,
      encryptedHash,
      username
    );
    console.log("response", response);
    if (response != null) {
      setProgess(0);
      setUploading(false);
    }
  };

  const classes = useStyles();
  const showTitle = "Add patient medical records - " + patientID;
  return (
    <>
      <Appbar showTitle={showTitle} />
      <Container maxWidth="md">
        <Paper className={classes.content}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
                <TextField
                  name="patient"
                  fullWidth
                  label="Patient"
                  variant="outlined"
                  margin="normal"
                  disabled
                  value={patientDetails.firstname + " " + patientDetails.lastname}
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
                  value={new Date().toLocaleString()}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                  name="age"
                  fullWidth
                  label="Age"
                  variant="outlined"
                  margin="normal"
                  required
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                  name="sex"
                  fullWidth
                  label="Sex"
                  variant="outlined"
                  margin="normal"
                  required
                  value={sex}
                  onChange={(e) => {
                    setSex(e.target.value);
                  }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                  name="weight"
                  fullWidth
                  label="Weight"
                  variant="outlined"
                  margin="normal"
                  required
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                  }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                  name="temperature"
                  fullWidth
                  label="Temperature"
                  variant="outlined"
                  margin="normal"
                  required
                  value={temp}
                  onChange={(e) => {
                    setTemp(e.target.value);
                  }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                  name="heartrate"
                  fullWidth
                  label="Heart Rate"
                  variant="outlined"
                  margin="normal"
                  required
                  value={heart}
                  onChange={(e) => {
                    setHeart(e.target.value);
                  }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                  name="bp"
                  fullWidth
                  label="Blood Pressure"
                  variant="outlined"
                  margin="normal"
                  required
                  value={bp}
                  onChange={(e) => {
                    setBP(e.target.value);
                  }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                  name="symptoms"
                  fullWidth
                  label="Symptoms"
                  variant="outlined"
                  margin="normal"
                  required
                  value={symptoms}
                  onChange={(e) => {
                    setSymptoms(e.target.value);
                  }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                  name="diagnosis"
                  fullWidth
                  label="Diagnosis"
                  variant="outlined"
                  margin="normal"
                  required
                  value={diagnosis}
                  onChange={(e) => {
                    setDiagnosis(e.target.value);
                  }}
                />
            </Grid>
            {
              tests.map((option, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    name="test"
                    fullWidth
                    label={"Test "+ index}
                    variant="outlined"
                    margin="normal"
                    disabled
                    value={option}
                  />
                </Grid>
              ))
            }
            <Grid item xs={12}>
                <Button variant="contained" color="primary" component="span" onClick={() => {setOpenDialogTest(true)}}>
                  Add Test
                </Button>
            </Grid>
            {
              medication.map((option, index) => (
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
            <Grid item xs={12}>
                <Button variant="contained" color="primary" component="span" onClick={() => {setOpenDialogMed(true)}}>
                  Add Medication
                </Button>
            </Grid>
            <Grid item xs={12}>
              <Input
                accept="image/*,.pdf,.docx"
                type="file"
                id="adding-files"
                multiple
                ref={el}
                onChange={handleChange}
                style={{display: 'none'}}
              />
              <label htmlFor="adding-files">
                <Button variant="contained" color="primary" component="span">
                  Add Files (Image/Doc/PDF)
                </Button>
              </label>
            </Grid>
            {
              photos.map((option, index) => (
                <Grid item xs={12} key={index}>
                  <embed src={option}  height="100%" width="100%" />
                  <br></br>
                  <Button variant="contained" color="primary" component="span" onClick={() => {setPhotos(photos.filter((item, index2) => index !== index2))}}>
                    Remove
                  </Button>
                </Grid>
              ))
            }
            <Grid item xs={12}>
              <Button variant="contained" color="primary" component="span" onClick={submitRecord}>
                Submit Record
              </Button>
            </Grid>
          </Grid>
        </Paper>
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
      <DialogBox
        // onClose={handleOnDialogClose}
        text="Enter Test details"
        title="Test"
        open={openDialogTest}
        buttons={buttonsTest}
      >
        <TextField
          name="test"
          fullWidth
          label="Test"
          variant="outlined"
          margin="normal"
          required
          value={test}
          onChange={(e) => {
            setTest(e.target.value);
          }}
        />
      </DialogBox>
      <DialogBox
        // onClose={handleOnDialogClose}
        title="Medication details"
        open={openDialogMed}
        buttons={buttonsMed}
      >
        <TextField
          name="medicine"
          fullWidth
          label="Name of Medicine"
          variant="outlined"
          margin="normal"
          required
          value={medicine}
          onChange={(e) => {
            setMedicine(e.target.value);
          }}
        />
        <TextField
          name="frequency"
          fullWidth
          label="Frequency per Day"
          variant="outlined"
          margin="normal"
          required
          value={frequency}
          onChange={(e) => {
            setFrequency(e.target.value);
          }}
        />
        <TextField
          name="days"
          fullWidth
          label="No of Days"
          variant="outlined"
          margin="normal"
          required
          value={days}
          onChange={(e) => {
            setDays(e.target.value);
          }}
        />
      </DialogBox>
      {/* <SnackBar open={snackBarOpen} />; */}
    </>
  );
}

export default connect(mapStateToProps)(Add);

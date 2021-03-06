import React, { useRef, useState } from "react";
import Appbar from "../components/Appbar";
// import SnackBar from "../components/SnackBar";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import DialogBox from "../components/Dialog";
import MedicalRecordCard from "../components/MedicalRecordCard";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/";
import LinearProgress from "@material-ui/core/LinearProgress";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { handleWrite, handleReadRevoke } from "../services/contractCalls";
import cryptico from "cryptico";
import CryptoJS from "crypto-js";

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

function Records(props) {
  const [photo, setPhoto] = useState("");
  const [file, setFile] = useState("");
  const [progress, setProgess] = useState(0); // progess bar
  const el = useRef(); // accesing input element
  const [uploading, setUploading] = useState(false);
  const [hospitalPassPhrase, setHospitalPassPhrase] = useState("");
  const [openDialogView, setOpenDialogView] = useState(true);
  const [masterFile, setMasterFile] = useState([]);
  // const [snackBarOpen, setSnackBarOpen] = useState(false);

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

  const handleChange = (e) => {
    console.log("Reading and Encrypting file");
    setProgess(0);
    const file = e.target.files[0]; // accessing file
    //const encryptedHash = cryptico.encrypt(receivedHash, patientDetails.encryptionKey);

    const reader = new window.FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFile(CryptoJS.AES.encrypt(reader.result, "aadhar number").toString());
    };
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
          hospitalPassPhrase,
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
            setMasterFile(JSONMasterFile);
            return JSONMasterFile;
            // console.log(JSONFile.toString(CryptoJS.enc.Utf8)
          });
      }
    );
  };

  const uploadFile = async () => {
    let masterFile = await getMasterFile();
    setUploading(true);
    const result = await ipfs.add(file);
    const hash = result.path;
    console.log("ipfs", hash);
    masterFile.push(hash);
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

  const getMedicalRecord = async (hash) => {
    const url = "https://ipfs.infura.io/ipfs/" + hash;
    fetch(url)
      .then((res) => res.text())
      .then((res2) => {
        var bytes = CryptoJS.AES.decrypt(res2, "aadhar number");
        const data = bytes.toString(CryptoJS.enc.Utf8);
        setPhoto(data);
      });
  };

  const classes = useStyles();
  // const showTitle = "Add patient medical records - " + patientID;
  const showTitle = "Viewing Patient: " + patientID;
  return (
    <>
      <Appbar showTitle={showTitle} />
      <Container maxWidth="md">
        <Paper className={classes.content}>
          <Typography className="title" variant="h6">
            Add file
          </Typography>
          <Grid style={{ marginTop: "16px" }}>
            <>
              <Input type="file" ref={el} onChange={handleChange} />
              {progress > 0 && (
                <>
                  <Typography>Uploading file {progress} %</Typography>
                  <LinearProgress variant="determinate" value={progress} />
                </>
              )}
              {uploading && (
                <Button
                  color="primary"
                  onClick={cancelFileUpload}
                  className="upbutton"
                >
                  Cancel
                </Button>
              )}
              {!uploading && file && (
                <Button
                  color="primary"
                  onClick={uploadFile}
                  className="upbutton"
                >
                  Upload
                </Button>
              )}
            </>
          </Grid>
        </Paper>

        {photo && <img src={photo} alt="medical record" />}
        {masterFile &&
          masterFile.map((hash, index) => (
            <MedicalRecordCard
              name={hash}
              key={index}
              onClickDownload={() => getMedicalRecord(hash)}
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
      {/* <SnackBar open={snackBarOpen} />; */}
    </>
  );
}

export default connect(mapStateToProps)(Records);

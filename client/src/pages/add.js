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
import { handleWrite, handleRead } from "../services/contractCalls";
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

function View(props) {
  const [file, setFile] = useState(""); // storing the uploaded file
  // storing the recived file from backend
  const [progress, setProgess] = useState(0); // progess bar
  const el = useRef(); // accesing input element
  const [uploading, setUploading] = useState(false);
  const [masterFile, setMasterFile] = useState([]);
  const [hospitalPassPhrase, setHospitalPassPhrase] = useState("");
  const [openDialogView, setOpenDialogView] = useState(true);
  // const [snackBarOpen, setSnackBarOpen] = useState(false);

  const patientID = props.history.location.patientID;
  const details = props.history.location.data;

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
    //const encryptedHash = cryptico.encrypt(receivedHash, details.encryptionKey);

    const reader = new window.FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFile(AES.encrypt(reader.result, "aadhar number").toString());
    };
  };

  const cancelFileUpload = (e) => {
    setProgess(0);
    // do something to cancel the progress
    setUploading(false);
  };

  const getMasterFile = async () => {
    const accountsAvailable = await window.ethereum.request({
      method: "eth_accounts",
    });
    const address = details.scAccountAddress;

    handleRead(accountsAvailable[0], address).then((response) => {
      console.log("READ response", response);
      const hospitalPrivateKey = cryptico.generateRSAKey(
        hospitalPassPhrase,
        1024
      );
      const decryptedDataHash = cryptico.decrypt(response, hospitalPrivateKey);

      const url = "https://ipfs.infura.io/ipfs/" + decryptedDataHash;
      fetch(url)
        .then((res) => res.text())
        .then((res2) => {
          const jsonString = AES.decrypt(res2, "aadhar number");
          const JSONMasterFile = JSON.parse(jsonString);
          setMasterFile(JSONMasterFile);
          console.log("Masterfile", JSONMasterFile);
          // console.log(JSONFile.toString(CryptoJS.enc.Utf8)
        });
    });
  };

  const uploadFile = async () => {
    await getMasterFile();
    setUploading(true);
    const result = await ipfs.add(file);
    const hash = result.path;
    console.log("ipfs", hash);
    masterFile.push(hash);
    const newMasterFile = JSON.stringify(masterFile);
    const masterFileHash = await ipfs.add(newMasterFile);
    const encryptedMasterFileHash = cryptico.encrypt(
      masterFileHash,
      details.encryptionKey
    );
    saveOnSC(encryptedMasterFileHash);
  };

  const saveOnSC = async (encryptedHash) => {
    const accountsAvailable = await window.ethereum.request({
      method: "eth_accounts",
    });
    const address = details.scAccountAddress;
    const username = props.auth.user.username;
    const response = handleWrite(accountsAvailable[0], address, encryptedHash, username);
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

export default connect(mapStateToProps)(View);

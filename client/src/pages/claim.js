import React, { useState } from "react";
import Appbar from "../components/Appbar";
import { useHistory } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import DialogBox from "../components/Dialog";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/";
import TextField from "@material-ui/core/TextField";
import { handleWrite, handleReadRevoke } from "../services/contractCalls";
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

function Claim(props) {
  const history = useHistory();
  const [hospitalPassPhrase, setHospitalPassPhrase] = useState("");
  const [openDialogView, setOpenDialogView] = useState(true);
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


  const submitRecord = async () => {
    let masterFile = await getMasterFile();
    console.log('masterFile', masterFile)
    masterFile[masterFile.length - 1].insurer = props.auth.user.username
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
      history.push({
        pathname: '/'
      });
    }
  };

  const classes = useStyles();
  const showTitle = "Add patient medical records - " + patientID;
  // ! if (patientDetails && patientID) {
  return (
    <>
      <Appbar showTitle={showTitle} />
      <Container maxWidth="md">
        <Paper className={classes.content}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" component="span" onClick={submitRecord}>
                Settle Claim
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
    </>
  );
  // } else return null;
}

export default connect(mapStateToProps)(Claim);

import React, { useRef, useState } from "react";
import Appbar from "../components/Appbar";
import SnackBar from "../components/SnackBar";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import Input from "@material-ui/core/Input";
import { apiURL } from "../helpers/config";
import { authHeader } from "../services/authHeader";
import { handleWrite } from "../services/contractCalls";
import cryptico from "cryptico";
// const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: "68px",
    padding: "16px",
  },
}));

function View(props) {
  const [file, setFile] = useState(""); // storing the uploaded file
  // storing the recived file from backend
  // const [data, getFile] = useState({ name: "", path: "" });
  const [progress, setProgess] = useState(0); // progess bar
  const el = useRef(); // accesing input element
  const [uploading, setUploading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const patientID = props.history.location.patientID;
  const details = props.history.location.data;

  const handleChange = (e) => {
    setProgess(0);
    const file = e.target.files[0]; // accessing file
    console.log(file);
    setFile(file); // storing file
    // const reader = new window.FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onloadend = () => {
    //   setFile(Buffer(reader.result));
    // };
  };

  const cancelFileUpload = (e) => {
    setProgess(0);
    // do something to cancel the progress
    setUploading(false);
  };

  const uploadFile = async () => {
    setUploading(true);
    // const result = await ipfs.add(file)
    // const hash = result.path;
    // console.log(hash)

    const formData = new FormData();
    formData.append("file", file); // appending file
    //axios
    await axios({
      method: "post",
      url: apiURL + "/api/add",
      headers: authHeader(),
      data: formData,
      onUploadProgress: (ProgressEvent) => {
        let progress = Math.round(
          (ProgressEvent.loaded / ProgressEvent.total) * 100
        );
        setProgess(progress);
      },
    })
      .then((response) => {
        saveOnSC(response.data.hash);
      })
      .catch((err) => {
        console.log("err", err);
        setSnackBarOpen(true);
      });
  };

  const saveOnSC = async (receivedHash) => {
    const encryptedHash = cryptico.encrypt(receivedHash, details.encryptionKey);
    const accountsAvailable = await window.web3.eth.getAccounts();
    const address = details.scAccountAddress;
    const response = handleWrite(accountsAvailable[0], address, encryptedHash);
    console.log("response", response);
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
      <SnackBar open={snackBarOpen} />;
    </>
  );
}

export default View;

import React, { useState } from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import MedicalRecordCard from "../components/MedicalRecordCard";
import { handleRead } from "../services/contractCalls";
import TextField from "@material-ui/core";
import Button from "@material-ui/core";
import cryptico from "cryptico";
import DialogBox from "../components/Dialog";
import CryptoJS from "crypto-js";
// var CryptoJS = require("crypto-js");

function View(props) {
  const [photo, setPhoto] = useState("");
  const [hospitalPassPhrase, setHospitalPassPhrase] = useState("");
  const [openDialogView, setOpenDialogView] = useState(true);
  const [masterFile, setMasterFile] = useState([]);

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
    const address = details.scAccountAddress;

    handleRead(accountsAvailable[0], address).then((response) => {
      console.log("response", response);
      const hospitalPrivateKey = cryptico.generateRSAKey(
        hospitalPassPhrase,
        1024
      );
      const decryptedDataHash = cryptico.decrypt(response, hospitalPrivateKey);

      const url = "https://ipfs.infura.io/ipfs/" + decryptedDataHash;
      fetch(url)
        .then((res) => res.text())
        .then((res2) => {
          const jsonString = CryptoJS.AES.decrypt(res2, "aadhar number");
          const JSONMasterFile = JSON.parse(jsonString);
          setMasterFile(JSONMasterFile);
          console.log("Masterfile", JSONMasterFile);
          // console.log(JSONFile.toString(CryptoJS.enc.Utf8)
        });
    });
  };

  console.log(props);
  const patientID = props.history.location.patientID;
  const details = props.history.location.data;
  // TODO: check for viewing permission, other navigate away
  // TODO: navigate away when patientID is not set
  const showTitle = "Viewing Patient: " + patientID;
  return (
    <>
      <Appbar showTitle={showTitle} />
      <Container maxWidth="md" style={{ marginTop: "68px" }}>
        {photo === "" ? (
          <Button color="primary" onClick={getData} className="upbutton">
            View Files
          </Button>
        ) : (
          <img src={photo} alt="medical record" />
        )}
        {/* <MedicalRecordCard />
        <MedicalRecordCard />
        <MedicalRecordCard /> */}
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

export default View;

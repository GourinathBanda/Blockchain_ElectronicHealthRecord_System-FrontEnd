import React, { useState } from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import MedicalRecordCard from "../components/MedicalRecordCard";
import { handleRead } from "../services/contractCalls";
import { Button, TextField } from "@material-ui/core";
import cryptico from "cryptico";
import DialogBox from "../components/Dialog";

function View(props) {
  const [photo, setPhoto] = useState("");
  const [hospitalPassPhrase, setHospitalPassPhrase] = useState("");
  const [openDialogView, setOpenDialogView] = useState(true);

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

      const url = "https://ipfs.infura.io/ipfs/" + response;
      fetch(url)
        .then((res) => res.text())
        .then((res2) => {
          const hospitalPrivateKey = cryptico.generateRSAKey(
            hospitalPassPhrase,
            1024
          );
          const decryptedDataHash = cryptico.decrypt(res2, hospitalPrivateKey);
          const decryptedDataBytes = cryptico.decrypt(
            decryptedDataHash,
            "aadhar number"
          );
          // var bytes = CryptoJS.AES.decrypt(res2, "password");
          setPhoto(decryptedDataBytes.toString());
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
          <img src={photo} />
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

import React, {useState} from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import MedicalRecordCard from "../components/MedicalRecordCard";
import { handleRead } from "../services/contractCalls";
import { Button } from "@material-ui/core";

function View(props) {

  const [hash, setHash] = useState("");

  const getData = async () => {
    const accountsAvailable = await window.web3.eth.getAccounts();
    const address = details.scAccountAddress;
    const response = await handleRead(accountsAvailable[0], address);
    console.log("response", response);
    setHash(response);
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
        {
          hash==="" ?
          <Button
            color="primary"
            onClick={getData}
            className="upbutton"
          >
            View Files
          </Button>
          :
          <img src={'https://ipfs.infura.io/ipfs/'+hash} />
        }
        {/* <MedicalRecordCard />
        <MedicalRecordCard />
        <MedicalRecordCard /> */}
      </Container>
    </>
  );
}

export default View;

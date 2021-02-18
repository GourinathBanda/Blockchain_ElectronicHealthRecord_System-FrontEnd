import React from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import MedicalRecordCard from "../components/MedicalRecordCard";

function View(props) {
  console.log(props);
  const patientID = props.history.location.patientID;
  // TODO: check for viewing permission, other navigate away
  // TODO: navigate away when patientID is not set
  const showTitle = "Viewing Patient: " + patientID;
  return (
    <>
      <Appbar showTitle={showTitle} />
      <Container maxWidth="md" style={{ marginTop: "68px" }}>
        <MedicalRecordCard />
        <MedicalRecordCard />
        <MedicalRecordCard />
      </Container>
    </>
  );
}

export default View;

import React from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
// import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
import MedicalRecordCard from "../components/MedicalRecordCard";

function View(props) {
  const patientID = "abcdefg";
  const showTitle = "View patient - " + patientID;
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

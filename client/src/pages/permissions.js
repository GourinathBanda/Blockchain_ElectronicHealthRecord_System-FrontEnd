import React from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import NotificationCard from "../components/NotificationCard";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

function Permissions(props) {
  console.log(props);
  return (
    <>
      <Appbar showTitle="Permissions" />
      <Container maxWidth="md" style={{ marginTop: "68px" }}>
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
      </Container>
    </>
  );
}

export default connect(mapStateToProps)(Permissions);

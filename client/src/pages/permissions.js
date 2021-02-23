import React, { useState, useEffect } from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import NotificationCard from "../components/NotificationCard";
import DialogBox from "../components/Dialog";
import { connect } from "react-redux";
import { checkReader } from "../services/contractCalls";
import { checkWriter } from "../services/contractCalls";
import { grantWritePermission } from "../services/contractCalls";
import { grantReadPermission } from "../services/contractCalls";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

function Permissions(props) {
  const [reader, setReader] = useState("");
  const [writer, setWriter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [permissionType, setPermissionType] = useState("");
  useEffect(() => {
    const responseReader = checkReader(props.auth.user.scAccountAddress);
    if (responseReader) {
      setReader(responseReader);
    }
    const responseWriter = checkWriter(props.auth.user.scAccountAddress);
    if (responseWriter) {
      setWriter(responseWriter);
    }
  }, []);

  const handleGrantPermission = (type) => {
    if (type === "read") {
      grantReadPermission();
    } else if (type === "write") {
      grantWritePermission();
    }
  };

  // const buttonsRead = [
  //   {
  //     onClick: () => handleGrantPermission("read"),
  //     text: "Okay",
  //   },
  //   {
  //     onClick: () => setOpenDialogView(false),
  //     text: "Cancel",
  //   },
  // ];

  // const buttonsWrite = [
  //   {
  //     onClick: () => handleGrantPermission("write")(),
  //     text: "Okay",
  //   },
  //   {
  //     onClick: () => setOpenDialogAdd(false),
  //     text: "Cancel",
  //   },
  // ];

  console.log(props);
  return (
    // ! setup onclick, open dialog, set permission type
    <>
      <Appbar showTitle="Permissions" />
      <Container maxWidth="md" style={{ marginTop: "68px" }}>
        <NotificationCard name={reader} type="read" />
        <NotificationCard name={writer} type="write" />
      </Container>
      {/* <DialogBox
        // onClose={handleOnDialogClose}
        text="Asking user abc for read permission"
        title="Read Permission"
        open={openDialog}
        // buttonsView={buttonsAdd}
      /> */}
    </>
  );
}

export default connect(mapStateToProps)(Permissions);

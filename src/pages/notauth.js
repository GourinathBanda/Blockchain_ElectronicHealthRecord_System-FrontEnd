import React from "react";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const NotAuth = () => {
  return (
    <div>
      <Container maxWidth="xs" style={{ marginTop: "200px" }}>
        <Paper style={{ padding: "20px" }}>
          <Typography margin="normal" style={{ marginTop: "8px" }}>
            Access Denied
          </Typography>
          <Typography margin="normal" style={{ marginTop: "8px" }}>
            You do not have the permission to perform this action or view
            content.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            // onClick={(e) => setPatientID(textInput)}
          >
            Go back
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default NotAuth;

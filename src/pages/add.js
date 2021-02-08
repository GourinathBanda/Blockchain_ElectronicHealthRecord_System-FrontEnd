import React from "react";
import Appbar from "../components/Appbar";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: "68px",
    padding: "16px",
  },
}));

function View(props) {
  const classes = useStyles();
  const patientID = "abcdefg";
  const showTitle = "Add patient medical records - " + patientID;
  return (
    <>
      <Appbar showTitle={showTitle} />
      <Container maxWidth="md">
        <Paper className={classes.content}>
          <Typography className="title" variant="h6">
            Add files
          </Typography>
          <Grid style={{ marginTop: "16px" }}>
            <Button variant="contained" margin="normal">
              Add files
            </Button>
          </Grid>
          <Grid style={{ marginTop: "16px" }}>
            <Button variant="contained" margin="normal">
              Upload
            </Button>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export default View;

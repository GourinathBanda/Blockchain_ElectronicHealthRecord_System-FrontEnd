import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const MedicalRecordCard = (props) => {
  const classes = useStyles();
  const { date, name, insurer, viewpermission, onClickDownload, onClickView } = props;
  return (
    <Card className={classes.root} style={{ marginTop: "8px" }}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {date || "dd/mm/yyyy"}
        </Typography>
        <Typography variant="h5" component="h2">
          {name || "File Encrypted"}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {insurer && ("Insurance Claim Settled by " + insurer)}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {viewpermission || "File Encrypted"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClickDownload}>
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export default MedicalRecordCard;

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
  const { date, name, viewpermission } = props;
  return (
    <Card className={classes.root} style={{ marginTop: "8px" }}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {date || "11/12/2000"}
        </Typography>
        <Typography variant="h5" component="h2">
          {name || "File Encrypted"}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {viewpermission || "File Encrypted"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Download & Decrypt</Button>
        <Button size="small">View</Button>
      </CardActions>
    </Card>
  );
};

export default MedicalRecordCard;

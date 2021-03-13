import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

function DialogBox(props) {
  const { open, buttons, title, text, onClose } = props;
  return (
    <div>
      <Dialog onClose={onClose} aria-labelledby="Dialog title" open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
          {props.children}
        </DialogContent>
        <DialogActions>
          {buttons.map((button, index) => (
            <Button key={index} onClick={button.onClick}>
              {button.text}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogBox;

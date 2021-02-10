import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../redux/actionCreators/auth";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import NotificationsIcon from "@material-ui/icons/Notifications";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import DialogBox from "../components/Dialog";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
}));

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

function Appbar(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // const [selectedValue, setSelectedValue] = useState(emails[1]);
  const { showTitle } = props;
  let history = useHistory();
  const classes = useStyles();
  const openMenu = Boolean(anchorEl);

  const handleLogout = (e) => {
    props.logout();
    history.push("/login");
  };

  // Menu
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // MenuItem
  const handleNotification = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleViewAll = () => {};

  // Dialog
  const handleOnDialogClose = () => {
    setOpenDialog(false);
  };

  const handleGrant = () => {
    setOpenDialog(true);
  };

  const handleDeny = (value) => {
    setOpenDialog(false);
  };

  const buttons = [
    {
      onClick: { handleGrant },
      text: "Grant",
    },
    {
      onClick: { handleDeny },
      text: "Deny",
    },
  ];
  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {showTitle || "DMR: Decentralized Medical Records"}
          </Typography>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handleMenu}
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={openMenu}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleNotification}>
                ABCD asked for read permission
              </MenuItem>
              <MenuItem onClick={handleNotification}>
                EFGH asked for write permission
              </MenuItem>
              <MenuItem onClick={handleViewAll}>
                View all notifications
              </MenuItem>
            </Menu>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <DialogBox
        onClose={handleOnDialogClose}
        text="Grant read permission to abcdef?"
        title="[user] is asking for Read Permission"
        open={openDialog}
        buttons={buttons}
      />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);

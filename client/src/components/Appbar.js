import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../redux/actionCreators/auth";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import DialogBox from "../components/Dialog";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { grantWritePermission } from "../services/contractCalls";
import { grantReadPermission } from "../services/contractCalls";
import { checkReader } from "../services/contractCalls";
import { checkWriter } from "../services/contractCalls";

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
  const [anchorElNotifcations, setAnchorElNotifcations] = useState(null);
  const [anchorElAvatar, setAnchorElAvatar] = useState(null);
  const { showTitle } = props;
  let history = useHistory();
  const classes = useStyles();
  const openMenuNotifications = Boolean(anchorElNotifcations);
  const openMenuAvatar = Boolean(anchorElAvatar);

  const handleLogout = (e) => {
    props.logout();
    history.push("/logout");
  };

  // Menu
  const handleMenuNotifications = (event) => {
    setAnchorElNotifcations(event.currentTarget);
  };
  const handleMenuAvatar = (event) => {
    setAnchorElAvatar(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElNotifcations(null);
    setAnchorElAvatar(null);
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

  const handleGrant = async () => {
    setOpenDialog(true);
    console.log("grant", props.auth);
    // assuming write permission
    await grantWritePermission(
      await checkWriter(props.auth.user.scAccountAddress)
    );
    console.log("done");
  };

  const handleDeny = (value) => {
    setOpenDialog(false);
  };

  const buttons = [
    {
      onClick: handleGrant,
      text: "Grant",
    },
    {
      onClick: handleDeny,
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
              onClick={handleMenuNotifications}
              aria-controls="menu-notifications"
              aria-haspopup="true"
            >
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Menu
              id="menu-notifications"
              anchorEl={anchorElNotifcations}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={openMenuNotifications}
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

            <IconButton
              aria-label="show 15 new notifications"
              color="inherit"
              onClick={handleMenuAvatar}
              aria-controls="menu-avatar"
              aria-haspopup="true"
            >
              <Badge color="secondary">
                <AccountCircleIcon />
              </Badge>
            </IconButton>

            <Menu
              id="menu-avatar"
              anchorEl={anchorElAvatar}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={openMenuAvatar}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={(e) => {
                  history.push("/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  history.push("/smartcontract");
                }}
              >
                Deployed Medical Record
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
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

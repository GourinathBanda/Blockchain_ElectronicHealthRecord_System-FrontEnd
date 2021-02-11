import * as ActionTypes from "../actionTypes/auth";
import axios from "axios";
import { apiURL } from "../../helpers/config";
import { authHeader } from "../../services/authHeader";

// AUTO LOGIN
export const autoLogin = () => (dispatch) => {
  axios({
    method: "get",
    url: apiURL + "/api/users/autologin",
    headers: authHeader(),
  })
    // .then(response => response.json())
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem("ud", JSON.stringify(response.data));
        return dispatch(
          loginSuccess({
            username: response.data.username,
            role: response.data.role,
          })
        );
      }
    });
};

// LOGIN
export const login = (username, password) => (dispatch) => {
  const data = {
    username: username,
    password: password,
  };
  axios({
    method: "post",
    url: apiURL + "/api/users/login",
    data: data,
  })
    // .then(response => response.json())
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem("ud", JSON.stringify(response.data));
        return dispatch(
          loginSuccess({ username: username, role: response.data.role })
        );
      } else {
        dispatch(loginFailed(response.data.message));
      }
    })
    .catch((err) => {
      return dispatch(loginFailed(err.message));
    });
};

export const loginRequest = (user) => ({
  type: ActionTypes.LOGIN_REQUEST,
  payload: user,
});
export const loginSuccess = (user) => ({
  type: ActionTypes.LOGIN_SUCCESS,
  payload: user,
});
export const loginFailed = (errMessage) => ({
  type: ActionTypes.LOGIN_FAILED,
  payload: errMessage,
});

// LOGOUT
export const logout = () => (dispatch) => {
  axios({
    method: "get",
    url: apiURL + "/api/users/logout",
    headers: authHeader(),
  })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("ud");
        return dispatch(logoutSuccess());
      } else {
        throw new Error("Error: " + response.status.toString());
      }
    })
    .catch((err) => {
      return dispatch(logoutFailed(err.message));
    });
};
export const logoutSuccess = () => ({ type: ActionTypes.LOGOUT_SUCCESS });
export const logoutFailed = (errMessage) => ({
  type: ActionTypes.LOGOUT_FAILED,
  payload: errMessage,
});

import * as ActionTypes from "../actionTypes/register";
import axios from "axios";
import { apiURL } from "../../helpers/config";

// REGISTER
export const register = (user) => (dispatch) => {
  dispatch(registerRequest(user));
  console.log("user", user);
  axios({
    method: "post",
    url: apiURL + "/api/users/register",
    data: user,
  })
    .then((response) => {
      console.log(response);
      if (response.status === 200) return dispatch(registerSuccess());
      else throw new Error("Error: " + response.data.message.toString());
    })
    .catch((err) => {
      console.log(err);
      return dispatch(registerFailed(err.message));
    });
};
export const registerRequest = () => ({ type: ActionTypes.REGISTER_REQUEST });
export const registerSuccess = () => ({ type: ActionTypes.REGISTER_SUCCESS });
export const registerFailed = (errMessage) => ({
  type: ActionTypes.REGISTER_FAILED,
  payload: errMessage,
});
export const registerClear = () => ({ type: ActionTypes.REGISTER_CLEAR });

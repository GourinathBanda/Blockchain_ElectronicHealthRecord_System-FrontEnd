import * as ActionTypes from "../actionTypes/notification";
import axios from "axios";
import { apiURL } from "../../helpers/config";
import { authHeader } from "../../services/authHeader";

// FETCH
export const fetchNotification = () => (dispatch) => {
  axios({
    method: "get",
    url: apiURL + "/api/notification",
    headers: authHeader(),
  })
    .then((response) => {
      if (response.status === 200) {
        return dispatch(fetchNotificationSuccess(response.data));
      } else {
        return dispatch(fetchNotificationFailed(response.status));
      }
    })
    .catch((err) => {
      dispatch(fetchNotificationFailed(err.message));
    });
};

export const fetchNotificationSuccess = (data) => ({
  type: ActionTypes.FETCH_NOTIFICATION_SUCCESS,
  payload: data,
});
export const fetchNotificationFailed = (errMessage) => ({
  type: ActionTypes.FETCH_NOTIFICATION_FAILED,
  payload: errMessage,
});

// DELETE
export const deleteNotification = (notificationId) => (dispatch) => {
  axios({
    method: "delete",
    url: apiURL + "/api/notification",
    data: {
      _id: notificationId,
    },
    headers: authHeader(),
  })
    .then((response) => {
      if (response.status === 200) {
        return dispatch(deleteNotificationSuccess(notificationId));
      } else {
        return dispatch(deleteNotificationFailed(response.status.toString()));
      }
    })
    .catch((err) => dispatch(deleteNotificationFailed(err.message)));
};

export const deleteNotificationSuccess = (notificationId) => ({
  type: ActionTypes.DELETE_NOTIFICATION_SUCCESS,
  payload: notificationId,
});

export const deleteNotificationFailed = (errMessage) => ({
  type: ActionTypes.DELETE_NOTIFICATION_FAILED,
  payload: errMessage,
});

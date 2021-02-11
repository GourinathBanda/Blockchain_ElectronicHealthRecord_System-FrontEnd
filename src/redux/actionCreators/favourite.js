import * as ActionTypes from "../actionTypes/favourite";
import axios from "axios";
import { apiURL } from "../../helpers/config";
import { authHeader } from "../../services/authHeader";

export const addFavourite = (productId) => (dispatch) => {
  axios({
    method: "post",
    url: apiURL + "/api/favourite",
    data: {
      _id: productId,
    },
    headers: authHeader(),
  })
    .then((response) => {
      if (response.status === 200)
        return dispatch(addFavouriteSuccess(productId));
      else return dispatch(addFavouriteFailed(response.status.toString()));
    })
    .catch((err) => {
      dispatch(addFavouriteFailed(err.message));
    });
};

export const addFavouriteSuccess = (productId) => ({
  type: ActionTypes.ADD_FAVOURITE_SUCCESS,
  payload: productId,
});

export const addFavouriteFailed = (errMessage) => ({
  type: ActionTypes.ADD_FAVOURITE_FAILED,
  payload: errMessage,
});

// FETCH
export const fetchFavourite = () => (dispatch) => {
  // dispatch(favouriteLoading());
  axios({
    method: "get",
    url: apiURL + "/api/favourite",
    headers: authHeader(),
  })
    .then((response) => {
      if (response.status === 200) {
        return dispatch(fetchFavouriteSuccess(response.data));
      } else {
        return dispatch(fetchFavouriteFailed(response.status));
      }
    })
    .catch((err) => {
      dispatch(fetchFavouriteFailed(err.message));
    });
};

export const fetchFavouriteSuccess = (data) => ({
  type: ActionTypes.FETCH_FAVOURITE_SUCCESS,
  payload: data,
});
export const fetchFavouriteFailed = (errMessage) => ({
  type: ActionTypes.FETCH_FAVOURITE_FAILED,
  payload: errMessage,
});

// DELETE
export const deleteFavourite = (productId) => (dispatch) => {
  axios({
    method: "delete",
    url: apiURL + "/api/favourite",
    data: {
      _id: productId,
    },
    headers: authHeader(),
  })
    .then((response) => {
      if (response.status === 200) {
        return dispatch(deleteFavouriteSuccess(productId));
      } else {
        return dispatch(deleteFavouriteFailed(response.status.toString()));
      }
    })
    .catch((err) => dispatch(deleteFavouriteFailed(err.message)));
};

export const deleteFavouriteSuccess = (productId) => ({
  type: ActionTypes.DELETE_FAVOURITE_SUCCESS,
  payload: productId,
});

export const deleteFavouriteFailed = (errMessage) => ({
  type: ActionTypes.DELETE_FAVOURITE_FAILED,
  payload: errMessage,
});

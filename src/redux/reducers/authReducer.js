import * as ActionTypes from "../actionTypes/auth";

const initialState = {
  loggingIn: false,
  loggedIn: false,
  errMess: null,
  user: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.payload,
        errMess: null,
      };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.payload,
        errMess: null,
      };
    case ActionTypes.LOGIN_FAILED:
      return {
        ...state,
        errMess: action.payload,
      };

    case ActionTypes.LOGOUT_SUCCESS:
      return {};
    case ActionTypes.LOGOUT_FAILED:
      return state;

    default:
      return state;
  }
};

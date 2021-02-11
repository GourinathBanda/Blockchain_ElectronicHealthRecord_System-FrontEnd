import * as ActionTypes from "../actionTypes/notification";

export const notificationReducer = (
  state = {
    errMess: null,
    notification: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.FETCH_NOTIFICATION_SUCCESS:
      return { errMess: null, notification: action.payload };
    case ActionTypes.FETCH_NOTIFICATION_FAILED:
      return { ...state, errMess: action.payload };

    // case ActionTypes.ADD_NOTIFICATION_SUCCESS:
    //   if (state.notification.some((el) => el === action.payload)) return state;
    //   return {
    //     ...state,
    //     errMess: null,
    //     notification: [...state.notification, action.payload],
    //   };

    // case ActionTypes.ADD_NOTIFICATION_FAILED:
    //   return { ...state, errMess: action.payload };

    case ActionTypes.DELETE_NOTIFICATION_SUCCESS:
      return {
        errMess: null,
        notification: state.notification.filter(
          (item) => item._id !== action.payload
        ),
      };

    case ActionTypes.DELETE_NOTIFICATION_FAILED:
      return { ...state, errMess: action.payload };

    default:
      return state;
  }
};

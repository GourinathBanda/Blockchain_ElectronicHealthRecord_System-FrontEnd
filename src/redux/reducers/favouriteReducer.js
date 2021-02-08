
import * as ActionTypes from '../actionTypes/favourite'

export const favouriteReducer = (
    state = {
        errMess: null,
        favourite: []
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.FETCH_FAVOURITE_SUCCESS:
            return { errMess: null, favourite: action.payload }
        case ActionTypes.FETCH_FAVOURITE_FAILED:
            return { ...state, errMess: action.payload }

        case ActionTypes.ADD_FAVOURITE_SUCCESS:
            if (state.favourite.some(el => el === action.payload))
                return state
            return { ...state, errMess: null, favourite: [...state.favourite, action.payload] }

        case ActionTypes.ADD_FAVOURITE_FAILED:
            return { ...state, errMess: action.payload }

        case ActionTypes.DELETE_FAVOURITE_SUCCESS:
            return { errMess: null, favourite: state.favourite.filter((item) => item._id !== action.payload) };

        case ActionTypes.DELETE_FAVOURITE_FAILED:
            return { ...state, errMess: action.payload }

        default:
            return state;
    }
}
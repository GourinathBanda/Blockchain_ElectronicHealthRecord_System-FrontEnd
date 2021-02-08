import * as ActionTypes from '../actionTypes/register'

const initialState = { errMess: null, registerd: false, registering: false };

export const registerReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionTypes.REGISTER_REQUEST:
            return { registering: true, registerd: false, errMess: false };
        case ActionTypes.REGISTER_SUCCESS:
            return { registering: false, registerd: true, errMess: false };
        case ActionTypes.REGISTER_FAILED:
            return { errMess: action.payload };
        case ActionTypes.REGISTER_CLEAR:
            return initialState;
            
        default:
            return state
    }
}
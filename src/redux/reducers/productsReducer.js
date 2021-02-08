import * as ActionTypes from '../actionTypes/products'
export const productsReducer = (
    state = {
        errMess: null,
        products: []
    },
    action
) => {
    switch (action.type) {

        // ADD
        case ActionTypes.ADD_PRODUCT_SUCCESS:
            if (state.products.some(el => el._id === action.payload._id))
                return state
            return { errMess: null, products: [...state.products, action.payload] };

        case ActionTypes.ADD_PRODUCT_FAILED:
            return { ...state, errMess: action.payload };


        // FETCH SINGLE PRODUCT
        case ActionTypes.FETCH_PRODUCT_SUCCESS:
            if (state.products.some(el => el._id === action.payload._id))
                return state
            return { errMess: null, products: [...state.products, action.payload] };

        case ActionTypes.FETCH_PRODUCT_FAILED:
            return { ...state, errMess: action.payload };


        // FETCH MULTIPLE ALL_PRODUCTS
        case ActionTypes.FETCH_ALL_PRODUCTS_SUCCESS:
            return { errMess: null, products: action.payload };

        case ActionTypes.FETCH_ALL_PRODUCTS_FAILED:
            return { ...state, errMess: action.payload };


        // EDIT
        case ActionTypes.EDIT_PRODUCT_SUCCESS:
            const editedProducts = state.products.map(product => {
                if (product._id === action.payload._id)
                    return action.payload;
                return product;
            })
            return { ...state, errMess: null, products: editedProducts }

        case ActionTypes.EDIT_PRODUCT_FAILED:
            return { ...state, errMess: action.payload };


        // DELETE
        case ActionTypes.DELETE_PRODUCT_SUCCESS:
            const newProducts = state.products.filter((item) => item._id !== action.payload);
            return { ...state, errMess: null, products: newProducts };

        case ActionTypes.DELETE_PRODUCT_FAILED:
            return { ...state, errMess: action.payload };

        default:
            return state;
    }
}
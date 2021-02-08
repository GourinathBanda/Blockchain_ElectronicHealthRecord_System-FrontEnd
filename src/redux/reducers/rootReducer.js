import { combineReducers } from "redux";
// import { productsReducer } from "./productsReducer";
// import { favouriteReducer } from "./favouriteReducer";
import { authReducer } from "./authReducer";
import { registerReducer } from "./registerReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
});
// products: productsReducer,
// favourite: favouriteReducer,

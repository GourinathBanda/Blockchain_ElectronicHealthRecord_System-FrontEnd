import * as ActionTypes from "../actionTypes/products";
import axios from "axios";
import { apiURL } from "../../helpers/config";
import { apiURL } from "../../config";

// ADD SINGLE PRODUCT
export const addProduct = (product) => (dispatch) => {
  axios({
    method: "post",
    url: apiURL + "/api/products",
    data: {
      name: product.name,
      desc: product.desc,
      extdesc: product.extdesc,
      imgsrc: product.imgsrc,
      price: product.price,
    },
    headers: authHeader,
  })
    .then((response) => {
      if (response.status === 200)
        return dispatch(addProductSuccess(response.data));
      throw new Error("Error: " + response.status.toString());
    })
    .catch((err) => {
      dispatch(addProductFailed(err.message));
    });
};

export const addProductSuccess = (productData) => ({
  type: ActionTypes.ADD_PRODUCT_SUCCESS,
  payload: productData,
});

export const addProductFailed = (errMessage) => ({
  type: ActionTypes.ADD_PRODUCT_FAILED,
  payload: errMessage,
});

// FETCH A PRODUCT
export const fetchProduct = (productId) => (dispatch) => {
  // dispatch(fetchProductLoading);
  console.log("fetch url", apiURL + "/api/products/" + productId);
  axios({
    method: "get",
    url: apiURL + "/api/products/" + productId,
  })
    .then((response) => {
      return response.data;
    })
    .then((productData) => {
      dispatch(fetchProductSuccess(productData));
    })
    .catch((err) => {
      dispatch(fetchProductFailed(err.message));
    });
};

export const fetchProductLoading = () => ({
  type: ActionTypes.FETCH_PRODUCT_LOADING,
});

export const fetchProductSuccess = (productData) => ({
  type: ActionTypes.FETCH_PRODUCT_SUCCESS,
  payload: productData,
});

export const fetchProductFailed = (errMessage) => ({
  type: ActionTypes.FETCH_PRODUCT_FAILED,
  payload: errMessage,
});

// FETCH ALL_PRODUCTS
export const fetchAllProducts = () => (dispatch) => {
  // dispatch(fetchAllProductsLoading);
  axios({
    method: "get",
    url: apiURL + "/api/products",
  })
    .then((response) => {
      return response.data;
    })
    .then((productsData) => {
      dispatch(fetchAllProductsSuccess(productsData));
    })
    .catch((err) => {
      dispatch(fetchAllProductsFailed(err.message));
    });
};

export const fetchAllProductsLoading = () => ({
  type: ActionTypes.FETCH_ALL_PRODUCTS_LOADING,
});

export const fetchAllProductsSuccess = (productsData) => ({
  type: ActionTypes.FETCH_ALL_PRODUCTS_SUCCESS,
  payload: productsData,
});

export const fetchAllProductsFailed = (errMessage) => ({
  type: ActionTypes.FETCH_ALL_PRODUCTS_FAILED,
  payload: errMessage,
});

// EDIT
export const editProduct = (product) => (dispatch) => {
  console.log("EDITING PRODUCT", authHeader);
  axios({
    method: "put",
    url: apiURL + "/api/products/" + product.productId,
    data: {
      name: product.name,
      desc: product.desc,
      extdesc: product.extdesc,
      imgsrc: product.imgsrc,
      price: product.price,
    },
    headers: authHeader,
  })
    .then((response) => {
      console.log("EDIT RESPONSE", response);
      if (response.status === 200)
        return dispatch(editProductSuccess(response.data));
      throw new Error("Error: " + response.status.toString());
    })
    .catch((err) => dispatch(editProductFailed(err.message)));
};

export const editProductSuccess = (data) => ({
  type: ActionTypes.EDIT_PRODUCT_SUCCESS,
  payload: data,
});

export const editProductFailed = (errMessage) => ({
  type: ActionTypes.EDIT_PRODUCT_FAILED,
  payload: errMessage,
});

// DELETE PRODUCT
export const deleteProduct = (productId) => (dispatch) => {
  axios({
    method: "delete",
    url: apiURL + "/api/products/" + productId,
    headers: authHeader,
  })
    .then((response) => {
      console.log("DELETE RESPONSE", response);
      if (response.status === 200)
        return dispatch(deleteProductSuccess(productId));
      throw new Error("Error: " + response.status.toString());
    })
    .catch((err) => dispatch(deleteProductFailed(err.message)));
};

export const deleteProductSuccess = (productId) => ({
  type: ActionTypes.DELETE_PRODUCT_SUCCESS,
  payload: productId,
});

export const deleteProductFailed = (errMessage) => ({
  type: ActionTypes.DELETE_PRODUCT_FAILED,
  payload: errMessage,
});

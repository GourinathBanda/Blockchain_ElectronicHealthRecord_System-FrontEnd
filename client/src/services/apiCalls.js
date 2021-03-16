import axios from "axios";
import { apiURL } from "../helpers/config";
import { authHeader } from "./authHeader";

export const getCurrentUser = () => {
  return (
    axios({
      method: "get",
      url: apiURL + "/api/users/user",
      headers: authHeader(),
    })
      // .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
  );
};

export const updateCurrentUser = (user) => {
  return (
    axios({
      method: "put",
      url: apiURL + "/api/users/user",
      headers: authHeader(),
      data: user,
    })
      // .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          return "SUCCESSFUL";
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
  );
};

export const getBasicUserDetails = (id, method) => {
  return axios({
    method: "get",
    url: apiURL + "/api/users/basicdetails/" + method + "/" + id,
    headers: authHeader(),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export const getBasicHospitalDetails = (id) => {
  return axios({
    method: "get",
    url: apiURL + "/api/users/hospitalKey/" + id,
    headers: authHeader(),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export const checkRSAKeysGenerated = () => {
  return axios({
    method: "get",
    url: apiURL + "/api/users/checkKey",
    headers: authHeader(),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

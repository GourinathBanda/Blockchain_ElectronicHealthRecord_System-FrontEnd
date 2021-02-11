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

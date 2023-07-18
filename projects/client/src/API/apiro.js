import axios from "axios";

export const apiro = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    key: "sgfjkfnrissvsdn",
    keyy: "3de72acb5b64c4e2160897c8b4ddecd7",
  },
});

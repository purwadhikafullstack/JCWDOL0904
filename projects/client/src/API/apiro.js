import axios from "axios";

export const apiro = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    key: "sgfjkfnrissvsdn",
    keyy: "6e986f2bcfda928e9e2e14d0fbc74b1c",
  },
});

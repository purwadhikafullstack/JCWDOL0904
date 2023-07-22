import axios from "axios";

export const apiro = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    key: "sgfjkfnrissvsdn",
    keyy: "f5eb6335206f2fc2771aa96bf9842d6b",
  },
});

import axios from "axios";

export const apiro = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    key: "sgfjkfnrissvsdn",
    keyy: "f31c92175c1d66a21b70b35b03ba4fce",
  },
});

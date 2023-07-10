import axios from "axios";

export const apiro = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    key: "sgfjkfnrissvsdn",
    keyy: "c8fba2d6d3a19bda986c05e07a7093a3",
  },
});

import axios from "axios"

export const apiro = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
    headers: {
        key: "sgfjkfnrissvsdn",
        keyy: "2ac59d0ce83fc9a3aec3c06c8734e3c9"
    }
})
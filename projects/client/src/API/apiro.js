import axios from "axios"

export const apiro = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
    headers: {
        key: "sgfjkfnrissvsdn",
        keyy: "2b312c76d4f8e33b82e4d6644ed24831"
    }
})
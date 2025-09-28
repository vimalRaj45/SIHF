import axios from "axios";

const API = axios.create({
  baseURL: "https://be0b0c4b2e1c.ngrok-free.app", // your Flask backend
  headers: {
    "ngrok-skip-browser-warning": "true" // bypass the Ngrok warning page
  },
});

export default API;

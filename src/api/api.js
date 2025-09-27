import axios from "axios";

const API = axios.create({
  baseURL: "https://2c6ad1f0fd3d.ngrok-free.app", // your Flask backend
  headers: {
    "ngrok-skip-browser-warning": "true" // bypass the Ngrok warning page
  },
});

export default API;

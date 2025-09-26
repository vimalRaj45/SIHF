import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",  // your Flask backend
});

export default API;

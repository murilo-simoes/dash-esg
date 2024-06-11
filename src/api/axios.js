import axios from "axios";

export const api = axios.create({
  // baseURL: "https://dashesgapi.onrender.com",
  baseURL: "http://localhost:8000",
});
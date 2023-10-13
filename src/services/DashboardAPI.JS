const baseURL = process.env.VUE_APP_BACKEND_APP_API_URL;
import axios from "axios";

const authApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});


const token = localStorage.getItem("token");
if (token) {
  authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function stats() {
  return authApi.get("/statistics");
}
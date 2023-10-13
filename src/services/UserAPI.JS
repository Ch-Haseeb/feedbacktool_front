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


export function getUserFeedback(){
    return authApi.get("/user_feedback");
}

export function userUpdate(userData){
    userData._method = "PUT";
    return authApi.post("/profile/update", userData);
}
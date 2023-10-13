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


export function getComments(){
    return authApi.get("/feedback/comment");
}

export function addComment(feedbackId, commentData){
    return authApi.post(`feedback/${feedbackId}/comment`,commentData);
}

export function deleteComment(feedbackId, commentId){
    return authApi.delete(`feedback/${feedbackId}/comment/${commentId}`);
}
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

export function get_feedback() {
  return authApi.get("/feedback");
}

export function addFeedback(feedbackData) {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return authApi.post("/feedback", feedbackData, config);
}

export function update_feedback(feedbackId, feedbackData) {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return authApi.post(`/feedback/${feedbackId}`, feedbackData, config);
}

export function deleteFeedback(feedbackId) {
  return authApi.delete(`/feedback/${feedbackId}`);
}

export function voteFeedback(feedbackId,vote){
  return authApi.post(`/feedback/${feedbackId}/vote`,vote)
}
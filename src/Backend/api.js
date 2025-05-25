import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8084/KrishiAgroBackend/api", // Update base URL as needed
  headers: { "Content-Type": "application/json" }
});

export default API;
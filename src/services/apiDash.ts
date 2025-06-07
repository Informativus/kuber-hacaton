import axios from "axios";

const apiDash= axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000",
  withCredentials: false,
});

export default apiDash;

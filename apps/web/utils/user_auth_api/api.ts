import axios from "axios";

const API_URL = "http://localhost:3001";

const axiosInstence = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await axiosInstence.post("/user/auth", {
    username,
    email,
    password,
  });
  return response.data.token;
};

export const signin = async (email: string, password: string) => {
  const response = await axiosInstence.post("/user/auth", {
    email,
    password,
  });
  return response.data.token;
};

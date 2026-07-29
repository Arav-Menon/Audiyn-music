import axios from "axios";
import { API_URL } from "../api_url";

const axiosInstence = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createRoom = async (
  name: string,
  code: string,
  isPrivate: boolean,
  password: string | null
) => {
  const body: Record<string, unknown> = { name, code, isPrivate };
  if (isPrivate) body.password = password;

  const response = await axiosInstence.post("/room/create-room", body);

  return response.data.newRoom.id;
};

export const getRoom = async (roomId: string) => {
  const response = await axiosInstence.get(`/room/${roomId}`);
  return response.data;
};

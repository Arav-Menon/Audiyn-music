import axios from "axios";
import { API_URL } from "../api_url";

interface CreateRoom {
  name: string;
  code: string;
  isPrivate?: string;
  password?: string;
}

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
  const response = await axiosInstence.post("/room/create-room", {
    name,
    code,
    isPrivate,
    password: isPrivate ? password : null,
  });
  console.table(response);
  console.log(response.data);
  console.log(response.headers);

  const res = response.data.newRoom.id;

  console.log("ROOM ID:", res);

  return response.data.newRoom.id;
};

console.log(createRoom);

export const getRoom = async (roomId: string) => {
  const response = await axiosInstence.get(`/room/${roomId}`);
  return response.data;
};

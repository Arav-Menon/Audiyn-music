import axios from "axios";
import { API_URL } from "../api_url";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface DashboardRoom {
  id: string;
  name: string;
  code: string;
  isPrivate: boolean;
  createdAt: string;
  adminId: string;
  host: string;
  streamCount: number;
  memberCount: number;
}

export async function getDashboardRooms(): Promise<DashboardRoom[]> {
  const response = await axiosInstance.get("/dashboard/rooms");
  return response.data.rooms;
}

export async function deleteRoom(roomId: string): Promise<void> {
  await axiosInstance.delete(`/room/rooms/${roomId}`);
}

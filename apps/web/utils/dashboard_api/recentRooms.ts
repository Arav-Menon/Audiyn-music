import axios from "axios";
import { API_URL } from "../api_url";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface RecentRoom {
  id: string;
  roomId: string;
  roomName: string;
  roomCode: string;
  hostName: string | null;
  lastJoinedAt: string;
}

export async function getRecentRooms(): Promise<RecentRoom[]> {
  const response = await axiosInstance.get("/user/recent-rooms");
  return response.data.recentRooms;
}

export async function removeRecentRoom(roomId: string): Promise<void> {
  await axiosInstance.delete(`/user/recent-rooms/${roomId}`);
}

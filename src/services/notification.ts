import type {Notification} from "../model/types.ts";
import api from "./api.ts";

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/api/players/notifications');
    return response.data;
};
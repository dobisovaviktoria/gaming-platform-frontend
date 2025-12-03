import {useQuery} from "@tanstack/react-query";
import {getNotifications} from "../services/notification.ts";


export function useNotifications() {
    const {isLoading, isError, data: notifications} =
        useQuery(
            {
                queryKey: ['notifications'],
                queryFn: () => getNotifications()
            })
    return {notifications, isLoading, isError};
}


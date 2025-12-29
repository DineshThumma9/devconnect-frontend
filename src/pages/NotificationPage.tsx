import axios from "axios";
import { useEffect, useState } from "react";
import {Notification, NotificationType} from "../entities/Notification.ts"
import useInitStore from "@/store/initStore";


const NotificationPage = () => {




    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const {username} = useInitStore();



    useEffect(() => {
        if (!username) return;

        getNotifications()
            .then(setNotifications)
            .catch(console.error);
    }
    , [username]);
    


    const getNotifications = async () => {
        // Dummy data for demonstration
        const notification = await axios.get(`/notifications/${username}`);
        const data = notification.data.map((notification:any) => {
            const res = Notification.safeParse(notification)
            return res.success ? res.data : null
        }).filter((notification:any) => notification !== null)
    
        return data
    }


    
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="space-y-4">
                {notifications.map((notification, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-gray-300">{notification.message}</p>
                    </div>
                ))}
            </div>
        </div>
    )
})
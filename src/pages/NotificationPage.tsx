import { useEffect, useState } from "react";
import { Notification, NotificationType } from "@/entities/Notification";
import useInitStore from "@/store/initStore";
import { axiosInstance } from "@/api/apiClient";
import { validateAndFilter } from "@/utils/validation";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import PageHeader from "@/components/PageHeader";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState(true);
    const { username } = useInitStore();

    useEffect(() => {
        if (!username) return;
        fetchNotifications();
    }, [username]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/notifications/${username}`);
            const validNotifications = validateAndFilter(response.data, Notification);
            setNotifications(validNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <PageHeader title="Notifications" icon="🔔" />
                <LoadingState type="list" count={5} />
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="Notifications" icon="🔔" />
            
            {notifications.length === 0 ? (
                <EmptyState
                    icon="🔔"
                    title="No notifications yet"
                    description="You'll see notifications here when someone interacts with your content"
                />
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id || notification.timestamp} className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-teal-500 transition-colors">
                            <p className="text-gray-300">{notification.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
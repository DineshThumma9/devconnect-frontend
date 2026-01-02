import { formatDistanceToNow } from "date-fns";

/**
 * Formats a date string or Date object into a relative time string
 * Examples: "just now", "5m", "2h", "3d", or full date
 */
export const formatRelativeTime = (dateString: string | Date): string => {
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        
        return date.toLocaleDateString();
    } catch {
        return 'recently';
    }
};

/**
 * Formats a date using date-fns formatDistanceToNow
 * Examples: "2 hours ago", "3 days ago"
 */
export const formatTimeAgo = (dateString: string | Date): string => {
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return formatDistanceToNow(date, { addSuffix: true });
    } catch {
        return 'recently';
    }
};

/**
 * Formats a date to a localized string
 */
export const formatDate = (dateString: string | Date): string => {
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date.toLocaleDateString();
    } catch {
        return '';
    }
};

import { ReactNode } from "react";

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
            {icon && (
                <div className="text-6xl mb-4 opacity-50">
                    {icon}
                </div>
            )}
            <p className="text-gray-300 text-lg mb-2">{title}</p>
            {description && (
                <p className="text-gray-500 text-sm">{description}</p>
            )}
            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
}

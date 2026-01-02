import { ReactNode } from "react";

interface PageHeaderProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    actions?: ReactNode;
}

export default function PageHeader({ icon, title, description, actions }: PageHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        {icon && <span className="text-teal-500">{icon}</span>}
                        <span>{title}</span>
                    </h1>
                    {description && (
                        <p className="text-gray-400 text-lg">{description}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";

interface ErrorMessageProps {
    message: string;
    action?: ReactNode;
}

export function ErrorMessage({ message, action }: ErrorMessageProps) {
    return (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p>{message}</p>
                    {action && (
                        <div className="mt-3">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useState, useCallback } from 'react';

/**
 * Hook for copying text to clipboard with feedback state
 * @param resetDelay - Time in ms before resetting copied state (default: 2000ms)
 */
export const useClipboard = (resetDelay: number = 2000) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), resetDelay);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    }, [resetDelay]);

    return { copied, copyToClipboard };
};

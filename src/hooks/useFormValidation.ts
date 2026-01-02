import { useState, useCallback } from 'react';

interface ValidationRule {
    validate: (value: any) => boolean;
    message: string;
}

interface UseFormValidationOptions {
    onSuccess?: () => void | Promise<void>;
}

/**
 * Hook for form validation with error state management
 */
export const useFormValidation = (options?: UseFormValidationOptions) => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateField = useCallback((value: any, rules: ValidationRule[]): boolean => {
        for (const rule of rules) {
            if (!rule.validate(value)) {
                setError(rule.message);
                return false;
            }
        }
        return true;
    }, []);

    const handleSubmit = useCallback(async (
        e: React.FormEvent,
        validationFn: () => boolean,
        submitFn: () => Promise<void>
    ) => {
        e.preventDefault();
        setError("");
        
        if (!validationFn()) {
            return;
        }

        setIsLoading(true);
        try {
            await submitFn();
            options?.onSuccess?.();
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }, [options]);

    const clearError = useCallback(() => setError(""), []);

    return {
        error,
        setError,
        isLoading,
        setIsLoading,
        validateField,
        handleSubmit,
        clearError
    };
};

// Common validation rules
export const ValidationRules = {
    required: (message: string = "This field is required"): ValidationRule => ({
        validate: (value) => Boolean(value && value.trim()),
        message
    }),

    minLength: (length: number, message?: string): ValidationRule => ({
        validate: (value) => value && value.length >= length,
        message: message || `Must be at least ${length} characters`
    }),

    maxLength: (length: number, message?: string): ValidationRule => ({
        validate: (value) => !value || value.length <= length,
        message: message || `Must be less than ${length} characters`
    }),

    email: (message: string = "Invalid email address"): ValidationRule => ({
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message
    }),

    matches: (otherValue: any, message: string = "Values do not match"): ValidationRule => ({
        validate: (value) => value === otherValue,
        message
    })
};

import { z } from "zod";

/**
 * Validates an array of data against a Zod schema and filters out invalid entries
 */
export function validateAndFilter<T>(
    data: unknown[],
    schema: z.ZodSchema<T>,
    options?: { logErrors?: boolean }
): T[] {
    const { logErrors = false } = options || {};

    return data
        .map((item) => {
            const result = schema.safeParse(item);
            
            if (!result.success && logErrors) {
                console.error("Validation failed:", result.error.format());
                console.error("Invalid data:", item);
            }
            
            return result.success ? result.data : null;
        })
        .filter((item): item is T => item !== null);
}

/**
 * Validates a single item against a Zod schema
 */
export function validateItem<T>(
    item: unknown,
    schema: z.ZodSchema<T>,
    options?: { throwOnError?: boolean; logError?: boolean }
): T | null {
    const { throwOnError = false, logError = true } = options || {};

    const result = schema.safeParse(item);

    if (!result.success) {
        if (logError) {
            console.error("Validation failed:", result.error.format());
            console.error("Invalid data:", item);
        }
        
        if (throwOnError) {
            throw new Error("Validation failed: " + JSON.stringify(result.error.format()));
        }
        
        return null;
    }

    return result.data;
}

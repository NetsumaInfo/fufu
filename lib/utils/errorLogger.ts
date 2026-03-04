/**
 * Safe error logging utilities
 * Prevents logging null/undefined values which cause "[Server] null" errors
 */

export function safeError(message: string, error?: unknown): void {
    if (error === null || error === undefined) {
        console.error(message);
        return;
    }

    console.error(message, error);
}

export function safeWarn(message: string, warning?: unknown): void {
    if (warning === null || warning === undefined) {
        console.warn(message);
        return;
    }

    console.warn(message, warning);
}

export function safeLog(message: string, data?: unknown): void {
    if (data === null || data === undefined) {
        console.log(message);
        return;
    }

    console.log(message, data);
}

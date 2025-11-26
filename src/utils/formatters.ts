/**
 * Formats a date object to a readable string.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

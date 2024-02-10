import { Paper } from "./interfaces";

export const sortByDate = (data: Paper[], order: 'asc' | 'desc' | 'default' = 'asc') => {
    return data.sort((a: any, b: any) => {
        // Check if both dates are null
        if (!a.publicationDate && !b.publicationDate) return 0;

        // Treat null as early date for ascending and late date for descending
        if (!a.publicationDate) return (order === 'asc' ? -1 : 1);
        if (!b.publicationDate) return (order === 'asc' ? 1 : -1);
      
        // Regular comparison if both dates are present
        return order === 'asc' ? a.publicationDate.localeCompare(b.publicationDate) : b.publicationDate.localeCompare(a.publicationDate);
    });
}

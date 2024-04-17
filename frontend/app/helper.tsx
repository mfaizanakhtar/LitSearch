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

export const getRandomPosition =(width:any, height:any, padding = 20)=>{
    const x = Math.random() * (width - 2 * padding) + padding;
    const y = Math.random() * (height - 2 * padding) + padding;
    console.log({ x:x, y:y })
    return { x:x, y:y };
  }
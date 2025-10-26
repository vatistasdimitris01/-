import type { Row } from './types';

export const SUPPLIERS: string[] = ['Σπαρκ', 'Βελβετ', 'Ντειλι', 'τροφιμα'];

// Helper to prevent timezone issues and get YYYY-MM-DD
export const formatDate = (date: Date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export const INITIAL_ROWS: Row[] = [];

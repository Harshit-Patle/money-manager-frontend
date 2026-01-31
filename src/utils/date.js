import { format, subDays, subMonths, subYears, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, differenceInHours } from 'date-fns';

export const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
    return format(new Date(date), 'MMM dd, yyyy hh:mm a');
};

export const formatTime = (date) => {
    return format(new Date(date), 'hh:mm a');
};

export const getDateRangeForFilter = (filterType) => {
    const now = new Date();

    switch (filterType) {
        case 'weekly':
            return {
                from: startOfWeek(now, { weekStartsOn: 1 }),
                to: endOfWeek(now, { weekStartsOn: 1 })
            };
        case 'monthly':
            return {
                from: startOfMonth(now),
                to: endOfMonth(now)
            };
        case 'yearly':
            return {
                from: startOfYear(now),
                to: endOfYear(now)
            };
        default:
            return {
                from: subMonths(now, 1),
                to: now
            };
    }
};

export const formatDateForInput = (date) => {
    return format(new Date(date), 'yyyy-MM-dd');
};

export const canEditTransaction = (createdAt, limitHours = 12) => {
    const hoursDiff = differenceInHours(new Date(), new Date(createdAt));
    return hoursDiff < limitHours;
};

export const getHoursRemaining = (createdAt, limitHours = 12) => {
    const hoursDiff = differenceInHours(new Date(), new Date(createdAt));
    return Math.max(0, limitHours - hoursDiff);
};
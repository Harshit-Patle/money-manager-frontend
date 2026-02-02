import {
    differenceInHours,
    endOfDay,
    endOfMonth,
    endOfWeek,
    format,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subDays,
    subMonths,
    subWeeks
} from 'date-fns';

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
            // Rolling last 7 days (today inclusive)
            return {
                from: startOfDay(subDays(now, 6)),
                to: endOfDay(now)
            };
        case 'monthly':
            // Rolling last 4 weeks aligned to week boundaries (Mon-Sun)
            return {
                from: startOfWeek(subWeeks(now, 3), { weekStartsOn: 1 }),
                to: endOfWeek(now, { weekStartsOn: 1 })
            };
        case 'yearly':
            // Rolling last 12 months aligned to month boundaries
            return {
                from: startOfMonth(subMonths(now, 11)),
                to: endOfMonth(now)
            };
        default:
            return {
                from: subMonths(now, 1),
                to: endOfDay(now)
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
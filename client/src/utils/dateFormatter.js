import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date, formatStr = 'PPP') => {
  return format(new Date(date), formatStr);
};

export const formatTime = (date, formatStr = 'p') => {
  return format(new Date(date), formatStr);
};

export const formatDateTime = (date, formatStr = 'PPpp') => {
  return format(new Date(date), formatStr);
};

export const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getDaysDifference = (date1, date2 = new Date()) => {
  const diff = new Date(date1) - new Date(date2);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

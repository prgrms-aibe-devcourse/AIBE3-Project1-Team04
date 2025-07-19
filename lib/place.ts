import { differenceInCalendarDays, differenceInHours, parseISO } from 'date-fns';

export const getStayDuration = (startDateStr: string, endDateStr: string) => {
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);

  const nights = differenceInCalendarDays(end, start);
  const days = nights + 1;

  return `${nights}박 ${days}일`;
};

export const getStayDuration_withTime = (startDateStr: string, endDateStr: string) => {
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);

  const hours = differenceInHours(end, start);
  if (hours < 24) {
    return `${hours}시간`;
  }

  const nights = differenceInCalendarDays(end, start);
  const days = nights + 1;

  return `${nights}박 ${days}일`;
};

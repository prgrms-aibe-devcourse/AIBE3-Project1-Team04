import { differenceInCalendarDays, parseISO } from 'date-fns';

export const getStayDuration = (startDateStr: string, endDateStr: string) => {
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);

  const nights = differenceInCalendarDays(end, start);
  const days = nights + 1;

  return `${nights}박 ${days}일`;
};

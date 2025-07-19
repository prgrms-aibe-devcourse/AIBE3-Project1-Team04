import { differenceInCalendarDays, parseISO } from 'date-fns';

export const getStayDuration = (startDateStr: string, endDateStr: string) => {
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);

  const nights = differenceInCalendarDays(end, start);
  const days = nights + 1;
  if (nights === 0) return `당일치기`;

  return `${nights}박 ${days}일`;
};

export const formatCost = (cost: number) => {
  if (cost === 0) return '무료';
  if (cost >= 10000) {
    return `${(cost / 10000).toFixed(0)}만원`;
  }
  return `${cost.toLocaleString()}원`;
};

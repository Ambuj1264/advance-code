export const checkIfScrollPositionHasReachedFooter = (
  scrollPosition: number,
  footerHeight: number
) => scrollPosition + window.innerHeight >= document.documentElement.scrollHeight - footerHeight;

export const createDateCaption = (startDate?: string, endDate?: string) =>
  startDate === endDate || (startDate && !endDate) ? `${startDate}` : `${startDate} - ${endDate}`;

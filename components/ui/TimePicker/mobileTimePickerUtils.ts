import { closestInteger } from "../../../utils/helperUtils";

export const padTime = (number: number) => number.toString().padStart(2, "0");

export const getTimeString = (h: number, m: number) => `${padTime(h)}:${padTime(m)}`;

export const parseTime = (
  timeStr: string,
  stepMinutes: number,
  useClosestStep: boolean,
  availableTime?: SharedTypes.AvailableTime
) => {
  const [hour, minute] = timeStr.split(":");
  let minuteNum = Number(minute);
  let hourNum = Number(hour);

  if (Number.isNaN(minuteNum)) minuteNum = 0;
  if (Number.isNaN(hourNum)) hourNum = 0;

  // find nearest step if user has choosen custom minute
  if (useClosestStep && minuteNum % stepMinutes !== 0) {
    minuteNum = closestInteger(minuteNum, stepMinutes);
    if (minuteNum >= 60) {
      minuteNum = 0;
      hourNum += 1;
    }
  }

  // find available hour if user has choosen unavailable time
  if (availableTime) {
    const { minHour, maxHour } = availableTime;
    hourNum = minHour && hourNum < minHour ? minHour : hourNum;
    hourNum = maxHour && hourNum > maxHour ? maxHour : hourNum;
  }

  return {
    minute: minuteNum,
    hour: hourNum,
  };
};

const travelshiftDebugHeaderName = "travelshift-debug";
const travelshiftDebugHeaderValue = "1";

export const isDebugRequest = (
  req?: { headers?: { [key: string]: string | string[] | undefined } } | null
) => {
  return req?.headers?.[travelshiftDebugHeaderName] === travelshiftDebugHeaderValue;
};

import { differenceInMinutes } from "date-fns";

export const setAsanaToken = (token: string) => {
  window.localStorage?.setItem("usersnapAsanaToken", token);
  window.localStorage?.setItem("usersnapAsanaTokenDateTime", new Date().toString());
};

export const getAsanaToken = () => {
  const token = window.localStorage?.getItem("usersnapAsanaToken") ?? undefined;
  const timeout = window.localStorage?.getItem("usersnapAsanaTokenDateTime");
  const minutes = differenceInMinutes(Date.now(), new Date(timeout ?? Date.now()));
  // The token expires in 30 minutes
  const isTokenExpired = minutes > 30;

  if (isTokenExpired) {
    return undefined;
  }
  return token;
};

export const writeToSessionStorage = (key: string, data: any) => {
  window.sessionStorage?.setItem(key, JSON.stringify(data));
};

export const readFromSessionStorage = (key: string) => {
  const value = window.sessionStorage?.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return undefined;
};

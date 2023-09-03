/* eslint-disable functional/immutable-data */
import { IncomingMessage, ServerResponse } from "http";

/**
 * @param expiresInSeconds defaults to 0, which gives you a session cookie
 * @param res Needed for setting cookies server-side
 */
export const setCookie = (
  name: string,
  value: string,
  // eslint-disable-next-line default-param-last
  expiresInSeconds = 0,
  res?: ServerResponse
) => {
  const date = new Date();

  date.setTime(date.getTime() + expiresInSeconds * 1000);

  const expire = expiresInSeconds === 0 ? "" : ` expires=${date.toUTCString()};`;

  const cookie = `${name}=${value};${expire} path=/`;

  if (res?.setHeader) {
    res.setHeader("Set-Cookie", cookie);
  } else if (typeof document !== "undefined") {
    document.cookie = cookie;
  }
};

/**
 * @param req Needed to get cookies server-side
 */
export const getCookie = (name: string, req?: IncomingMessage) => {
  let cookie = req?.headers?.cookie || "";
  if (typeof document !== "undefined") {
    cookie = document?.cookie || cookie;
  }
  const parts = `; ${cookie}`.split(`; ${name}=`);

  return (parts.length === 2 && parts.pop()?.split(";").shift()) || "";
};

export const clearPreviewCookie = () => setCookie("preview", "0");

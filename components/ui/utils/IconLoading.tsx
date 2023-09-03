import React from "react";

// these props below are just to avoid build linting errors
// we cannot use props for the loading components inside of next/dynamic
// https://github.com/vercel/next.js/issues/7906

// @ts-ignore
const IconLoading = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  styleName,
}: {
  className?: string;
  styleName?: string;
}) => {
  return <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" />;
};

export default IconLoading;

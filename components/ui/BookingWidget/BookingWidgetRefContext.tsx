import React, { RefObject } from "react";

const context = React.createContext<RefObject<HTMLDivElement>>({
  current: null,
});
export default context;
export const { Provider } = context;

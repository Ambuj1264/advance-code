import React from "react";

import { SupportedLanguages } from "types/enums";

const context = React.createContext<SupportedLanguages>(SupportedLanguages.English);

export default context;

export const { Provider } = context;

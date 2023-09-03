import { createContext } from "react";

type ConstantContext = {
  defaultOrigin?: string;
  defaultOriginId?: string;
  defaultDestination?: string;
  defaultDestinationId?: string;
  rangeAsDefault: boolean;
};

const context = createContext<ConstantContext>({
  defaultOrigin: undefined,
  defaultOriginId: undefined,
  defaultDestination: undefined,
  defaultDestinationId: undefined,
  rangeAsDefault: false,
});

export default context;

export const { Provider } = context;

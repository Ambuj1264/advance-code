import { createContext } from "react";

type ConstantContext = {
  originId?: string;
  origin?: string;
  destinationId?: string;
  destination?: string;
  searchPageUrl?: string;
  passportRequired: boolean;
  dateOfDeparture: string;
};

const context = createContext<ConstantContext>({
  originId: "",
  origin: "",
  destinationId: "",
  destination: "",
  searchPageUrl: "",
  passportRequired: false,
  dateOfDeparture: "",
});

export default context;

export const { Provider } = context;

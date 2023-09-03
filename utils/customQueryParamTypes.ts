import isValid from "date-fns/isValid";

const errorMessage = (module: string) => {
  const moduleError = console.error.bind(console, module);

  return function logError(...args: any[]) {
    moduleError(...args);
  };
};

const dateStringParamError = errorMessage("[ValidDateStringParam]");

export const ValidDateStringParam = {
  encode: (value?: string | string[]) => {
    if (value === undefined) return "";
    if (Array.isArray(value)) {
      dateStringParamError("encode:: we are not supporting array params yet");
      return "";
    }

    const dateToEncode = new Date(value);
    if (isValid(dateToEncode)) {
      return encodeURIComponent(value);
    }
    dateStringParamError("encode:: supplied date value is invalid for encoding", value);
    return "";
  },

  decode: (value?: string | string[]) => {
    if (value === undefined) return "";
    if (Array.isArray(value)) {
      dateStringParamError("decode:: we are not supporting array params yet");
      return "";
    }

    const decodedValue = decodeURIComponent(value);

    if (isValid(new Date(decodedValue))) {
      return decodedValue;
    }
    dateStringParamError("decode:: supplied date value is invalid", value);
    return "";
  },
};

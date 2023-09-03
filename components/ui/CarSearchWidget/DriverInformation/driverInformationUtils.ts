import { range } from "fp-ts/lib/Array";

export const driverAgeDefaultValue = "45";

export const driverAgeOptions: SelectOption[] = [
  ...range(18, 29).map(i => ({
    value: String(i),
    label: String(i),
    nativeLabel: String(i),
  })),
  {
    value: driverAgeDefaultValue,
    label: "30 - 65",
    nativeLabel: "30 - 65",
  },
  {
    value: "70",
    label: "65+",
    nativeLabel: "65+",
  },
];

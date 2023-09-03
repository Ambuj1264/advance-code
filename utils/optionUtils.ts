import { pipe } from "fp-ts/lib/pipeable";
import { Option, getOrElse } from "fp-ts/lib/Option";

export const getOptionValue = (value: Option<any>, defaultValue: any): any =>
  pipe(
    value,
    getOrElse(() => defaultValue)
  );

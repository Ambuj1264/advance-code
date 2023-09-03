import { EffectCallback, useEffect } from "react";

// eslint-disable-next-line react-hooks/exhaustive-deps
const useEffectOnce = (fn: EffectCallback) => useEffect(fn, []);

export default useEffectOnce;

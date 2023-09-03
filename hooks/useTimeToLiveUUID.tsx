import { useState, useEffect } from "react";

import { getUUID } from "utils/helperUtils";

const useTimeToLiveUUID = ({ timeToLiveInMs }: { timeToLiveInMs: number }) => {
  const [UUID, setState] = useState(getUUID());

  useEffect(() => {
    const interval = setInterval(() => setState(getUUID()), timeToLiveInMs);
    return () => clearInterval(interval);
  }, [timeToLiveInMs]);
  return UUID;
};

export default useTimeToLiveUUID;

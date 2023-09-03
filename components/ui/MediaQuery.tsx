import styled from "@emotion/styled";

import { mediaQuery } from "styles/base";
import { DisplayType } from "types/enums";

type props = {
  fromDisplay?: DisplayType;
  toDisplay?: DisplayType;
};

const getDisplayValue = (
  displayType: DisplayType,
  fromDisplay?: DisplayType,
  toDisplay?: DisplayType
) => {
  if ((fromDisplay && displayType === fromDisplay) || (toDisplay && displayType < toDisplay)) {
    return "block";
  }
  if ((fromDisplay && displayType < fromDisplay) || (toDisplay && displayType === toDisplay)) {
    return "none";
  }
  return undefined;
};

const MediaQuery = styled.div<props>(({ fromDisplay, toDisplay }) =>
  mediaQuery({
    display: [
      getDisplayValue(DisplayType.Small, fromDisplay, toDisplay),
      getDisplayValue(DisplayType.Medium, fromDisplay, toDisplay),
      getDisplayValue(DisplayType.Large, fromDisplay, toDisplay),
      getDisplayValue(DisplayType.Desktop, fromDisplay, toDisplay),
    ],
  })
);

export default MediaQuery;

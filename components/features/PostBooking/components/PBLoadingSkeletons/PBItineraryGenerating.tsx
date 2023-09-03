import React from "react";
import styled from "@emotion/styled";

import { PBErrorComponent } from "../PBError";

import GeneratingIcon from "components/icons/pin-flag-with-white.svg";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { whiteColor } from "styles/variables";

const StyledGeneratingIcon = styled(GeneratingIcon)`
  @keyframes pulse {
    0% {
      transform: scale(0.96);
    }

    50% {
      transform: scale(1);
    }

    100% {
      transform: scale(0.96);
    }
  }
  transform: scale(1);
  animation: pulse 3s infinite;
  circle {
    fill: ${whiteColor};
  }
`;

const PBItineraryGenerating = ({ className }: { className?: string }) => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  return (
    <PBErrorComponent
      className={className}
      text={postbookingT("Your travel plan is being created")}
      description={postbookingT("It will be ready soon")}
      Icon={StyledGeneratingIcon}
    />
  );
};

export default PBItineraryGenerating;

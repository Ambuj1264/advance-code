import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import {
  AutocompleteDoubleWrapper,
  Separator,
} from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { borderRadiusSmall, greyColor, gutters } from "styles/variables";
import { mqMin, skeletonPulse } from "styles/base";

const LoadingInput = styled.div([
  skeletonPulse,
  css`
    display: block;
    margin-bottom: ${gutters.small / 2}px;
    border: 1px solid ${rgba(greyColor, 0.2)};
    border-radius: ${borderRadiusSmall};
    width: 100%;
    height: 40px;

    ${mqMin.large} {
      margin-bottom: 0;
      height: 50px;
    }
  `,
]);

const CarnectLocationPickerLoading = ({
  isMobile,
  selectedPickupId,
  selectedDropoffId,
}: {
  isMobile: boolean;
  selectedPickupId?: string;
  selectedDropoffId?: string;
}) => {
  if (isMobile && selectedPickupId === selectedDropoffId) {
    return <LoadingInput />;
  }

  return (
    <AutocompleteDoubleWrapper>
      <LoadingInput />
      <Separator />
      <LoadingInput />
    </AutocompleteDoubleWrapper>
  );
};

export default CarnectLocationPickerLoading;

import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";

import { StyledSelectLoadingComponent } from "./FakeDropdown";

import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import Label from "components/ui/SearchWidget/Label";
import { gutters, whiteColor } from "styles/variables";
import DriverAge from "components/ui/CarSearchWidget/DriverInformation/DriverAge";
import DriverCountry from "components/ui/CarSearchWidget/DriverInformation/DriverCountry";
import { mqMax, mqMin, singleLineTruncation } from "styles/base";
import { NativeSelectPLaceholderBuilderInputType } from "components/ui/Inputs/Dropdown/NativeDropdown";
import { DisplayType } from "types/enums";
import MediaQuery from "components/ui/MediaQuery";
import { ArrowIcon } from "components/ui/Inputs/ContentDropdown";
import { typographyCaption } from "styles/typography";

const DriverItem = styled.div`
  width: 50%;
  :first-of-type {
    padding-right: ${gutters.large}px;
    ${mqMax.desktop} {
      padding-right: ${gutters.small / 2}px;
    }
  }
`;

export const DriverWrapper = styled.div`
  display: flex;

  ${mqMax.large} {
    flex-wrap: nowrap;
    justify-content: flex-end;

    ${DriverItem} {
      width: auto;
      &:first-of-type {
        padding-right: ${gutters.small}px;
      }
      &:last-of-type {
        max-width: 50%;
        padding-right: 0;
      }
    }
  }
`;

const StyledLongTextWithOverflow = styled.span(
  () => css`
    display: inline-block;
    ${singleLineTruncation};
    vertical-align: bottom;
  `
);

const StyledNativeSelectLabel = styled(Label)(
  () => css`
    display: flex;
    align-items: center;
    ${typographyCaption};

    ${mqMin.medium} {
      ${typographyCaption};
    }
  `
);

const StyledArrowIcon = styled(ArrowIcon)(
  () => css`
    margin-left: ${gutters.small / 4}px;
    width: ${gutters.small / 2}px;
    height: ${gutters.small / 2}px;
    transform: rotate(90deg);
    fill: ${whiteColor};
  `
);

const StyledSelectLoadingLabel = styled(Label)(
  () => css`
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    ${typographyCaption};

    ${mqMin.medium} {
      ${typographyCaption};
    }
  `
);

export const StyledDriverCountry = styled(DriverCountry)(
  () => css`
    ${mqMax.large} {
      ${StyledSelectLoadingComponent} {
        display: none;
        border: none;
        background: none;
      }
    }

    ${mqMin.large} {
      max-width: 150px;
      ${StyledSelectLoadingLabel} {
        display: none;
      }
    }
  `
);

const driverAgeNativeSelectPlaceholder: NativeSelectPLaceholderBuilderInputType = value => {
  return (
    <StyledNativeSelectLabel disablePointerEvents>
      <Trans ns={Namespaces.commonSearchNs}>Driver’s age</Trans>
      {`: ${value?.label}`}
      <StyledArrowIcon />
    </StyledNativeSelectLabel>
  );
};

const driverCountryNativeSelectPlaceholder: NativeSelectPLaceholderBuilderInputType = value => {
  return (
    <StyledNativeSelectLabel disablePointerEvents>
      <Trans ns={Namespaces.commonSearchNs}>I live in</Trans>
      <StyledLongTextWithOverflow>{`: ${value?.label}`}</StyledLongTextWithOverflow>
      <StyledArrowIcon />
    </StyledNativeSelectLabel>
  );
};

const CountryDriverInformation = ({
  driverAge,
  onSetDriverAge,
  driverCountry,
  onSetDriverCountry,
}: {
  driverAge: number;
  onSetDriverAge: (driverAge: string) => void;
  driverCountry?: string;
  onSetDriverCountry: (driverCountry: string) => void;
}) => {
  return (
    <DriverWrapper>
      <DriverItem>
        <MediaQuery fromDisplay={DisplayType.Large}>
          <Label>
            <Trans ns={Namespaces.commonSearchNs}>Driver’s age</Trans>
          </Label>
        </MediaQuery>
        <DriverAge
          id="countryDriverAgeDropdown"
          driverAge={driverAge}
          setDriverAge={onSetDriverAge}
          height={50}
          mobileHeight={42}
          nativeSelectBreakpoint={DisplayType.Large}
          nativeSelectPlaceholderFn={driverAgeNativeSelectPlaceholder}
        />
      </DriverItem>
      <DriverItem>
        <MediaQuery fromDisplay={DisplayType.Large}>
          <Label>
            <Trans ns={Namespaces.commonSearchNs}>I live in</Trans>
          </Label>
        </MediaQuery>
        <StyledDriverCountry
          id="countryDriverCountryDropdown"
          driverCountry={driverCountry}
          setDriverCountry={onSetDriverCountry}
          height={50}
          mobileHeight={24}
          nativeSelectBreakpoint={DisplayType.Large}
          nativeSelectPlaceholderFn={driverCountryNativeSelectPlaceholder}
          extraSelectLoadingLabel={
            <StyledSelectLoadingLabel>
              <Trans ns={Namespaces.commonSearchNs}>I live in</Trans>
              <Bubbles size="small" />
              <StyledArrowIcon />
            </StyledSelectLoadingLabel>
          }
        />
      </DriverItem>
    </DriverWrapper>
  );
};

export default CountryDriverInformation;

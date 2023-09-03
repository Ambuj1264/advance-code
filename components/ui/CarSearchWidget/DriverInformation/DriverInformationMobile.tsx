import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { DoubleLabel } from "../../MobileSteps/AutocompleteModalHelpers";

import DriverCountry from "./DriverCountry";
import DriverAge from "./DriverAge";

import { SeparatorWrapper } from "components/ui/Inputs/DateSelect";
import { greyColor } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { DropdownWrapper } from "components/ui/Inputs/Dropdown/Dropdown";

const StyledDriverAge = styled(DriverAge)(
  ({ theme }) => css`
    border-right: none;
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
    border-color: ${theme.colors.primary};
    #driverAgeDropdownMobileModal > div {
      border-right: none;
      border-top-right-radius: unset;
      border-bottom-right-radius: unset;
      border-color: ${theme.colors.primary};
    }
  `
);

const StyledDriverCountry = styled(DriverCountry)(
  ({ theme }) => css`
    border-left: none;
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
    border-color: ${theme.colors.primary};
    #driverCountryDropdownMobileModal > div {
      border-left: none;
      border-top-left-radius: unset;
      border-bottom-left-radius: unset;
      border-color: ${theme.colors.primary};
    }
  `
);

const DriverWrapper = styled.div`
  display: flex;
  ${DropdownWrapper} {
    width: 100%;
  }
`;

const Separator = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 1px;
  height: 20px;
  background-color: ${rgba(greyColor, 0.5)};
`;

const DriverInformationMobile = ({
  driverAge,
  setDriverAge,
  driverCountry,
  setDriverCountry,
}: {
  driverAge: number;
  setDriverAge: (driverAge: string) => void;
  driverCountry?: string;
  setDriverCountry: (driverCountry: string) => void;
}) => {
  const { t } = useTranslation(Namespaces.carSearchNs);
  return (
    <>
      <DoubleLabel leftLabel={t("Driver’s age")} rightLabel={t("I live in")} />
      <DriverWrapper>
        <StyledDriverAge
          id="driverAgeDropdownMobileModal"
          driverAge={driverAge}
          setDriverAge={setDriverAge}
        />
        <SeparatorWrapper>
          <Separator />
        </SeparatorWrapper>
        <StyledDriverCountry
          id="driverCountryDropdownMobileModal"
          driverCountry={driverCountry}
          setDriverCountry={setDriverCountry}
        />
      </DriverWrapper>
    </>
  );
};

export default DriverInformationMobile;

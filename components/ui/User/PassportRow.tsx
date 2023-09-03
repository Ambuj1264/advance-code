import React from "react";
import styled from "@emotion/styled";

import { ColumnWrapper } from "../FlightsShared/flightShared";
import Checkbox from "../Inputs/Checkbox";
import InputWrapper from "../InputWrapper";
import DateSelect from "../Inputs/DateSelect";

import { FullWidthColumn, StyledColumnItemWrapper, StyledUserInput } from "./SharedStyledComponent";

import { gutters } from "styles/variables";

const StyledCheckbox = styled(Checkbox)`
  margin-top: ${gutters.small / 2}px;
`;

const PassportRow = ({
  passportno,
  handlePassportChange,
  passportExpiration,
  handleExpireDateChange,
  handleNoExpiry,
  noPassportExpiration,
  selectHeight,
  borderColor,
  translate,
  id,
}: {
  passportno?: string;
  handlePassportChange: (newInfo: any) => void;
  passportExpiration: SharedTypes.Birthdate;
  borderColor: string;
  handleExpireDateChange: (dateObject: SharedTypes.Birthdate) => void;
  handleNoExpiry?: (newInfo: any) => void;
  noPassportExpiration?: boolean;
  selectHeight?: number;
  translate: TFunction;
  id: string;
}) => {
  return (
    <FullWidthColumn>
      <ColumnWrapper>
        <StyledColumnItemWrapper>
          <InputWrapper
            label={translate("Passport or ID number")}
            id="passportWrapper"
            hasError={false}
            customErrorMessage={translate("there is an error")}
          >
            <StyledUserInput
              id="passport"
              value={passportno}
              onChange={handlePassportChange}
              useDebounce={false}
              error={false}
              placeholder={translate("Add passport number")}
              isEditing
            />
          </InputWrapper>
        </StyledColumnItemWrapper>
        <StyledColumnItemWrapper>
          <InputWrapper
            label={translate("Expiration date")}
            id="passportExpiry"
            hasError={false}
            customErrorMessage={translate("there is an error")}
          >
            <DateSelect
              key="expirydate"
              date={passportExpiration}
              onDateChange={handleExpireDateChange}
              isExpiration
              error={false}
              selectHeight={selectHeight}
              disabled={noPassportExpiration}
              borderColor={noPassportExpiration ? undefined : borderColor}
            />
          </InputWrapper>
          <StyledCheckbox
            id={`noExpiryCheckbox${id}`}
            label={translate("No Expiry")}
            name={translate("No Expiry")}
            checked={noPassportExpiration}
            onChange={handleNoExpiry}
          />
        </StyledColumnItemWrapper>
      </ColumnWrapper>
    </FullWidthColumn>
  );
};

export default PassportRow;

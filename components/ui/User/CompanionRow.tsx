import React, { ChangeEvent, useMemo } from "react";
import styled from "@emotion/styled";

import InputWrapper from "../InputWrapper";

import { FullWidthColumn } from "./SharedStyledComponent";

import { getRelationOptions } from "components/features/User/utils/userUtils";
import DropdownLeft from "components/ui/Inputs/Dropdown/DropdownLeft";

const StyledFullWidthColumn = styled(FullWidthColumn)`
  margin-top: 0;
`;

const CompanionRow = ({
  id,
  relation,
  selectHeight,
  borderColor,
  handleRelationChange,
  translate,
}: {
  id: string;
  relation?: string;
  selectHeight: number;
  borderColor: string;
  handleRelationChange: (newInfo: string | boolean | ChangeEvent<HTMLInputElement>) => void;
  translate: TFunction;
}) => {
  const relationOptions = useMemo(() => getRelationOptions(), []);

  return (
    <StyledFullWidthColumn>
      <InputWrapper
        label={translate("Relation")}
        id={`${id}RelationDropdownWrapper`}
        hasError={false}
        customErrorMessage={translate("there is an error")}
      >
        <DropdownLeft
          id={`${id}relationDropdown`}
          selectHeight={selectHeight}
          options={relationOptions}
          onChange={handleRelationChange}
          selectedValue={relation && translate(relation)}
          error={false}
          placeholder={translate("Select")}
          isArrowHidden
          noDefaultValue
          borderColor={borderColor}
        />
      </InputWrapper>
    </StyledFullWidthColumn>
  );
};

export default CompanionRow;

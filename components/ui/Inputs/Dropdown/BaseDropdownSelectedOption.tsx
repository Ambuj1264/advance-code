import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { typographyBody2 } from "styles/typography";
import { greyColor } from "styles/variables";
import { singleLineTruncation, mqIE, mqMin } from "styles/base";

type Props = {
  data: SelectOption;
  icon?: React.ReactNode;
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Label = styled.div<{ hasIcon: boolean }>(({ hasIcon }) => [
  typographyBody2,
  singleLineTruncation,
  css`
    position: absolute;
    left: 50%;
    width: ${hasIcon ? "38%" : "75%"};
    max-width: 75%;
    color: ${greyColor};
    transform: translateX(-50%);
    ${mqIE} {
      top: 50%;
      transform: translate(-50%, -50%);
    }
    ${mqMin.desktop} {
      width: ${hasIcon ? "45%" : "75%"};
    }
  `,
]);

const BaseDropdownSelectedOption = ({ data, icon }: Props) => {
  return (
    <Wrapper>
      {icon && icon}
      <Label data-selected hasIcon={icon !== undefined}>
        {data.nativeLabel}
      </Label>
    </Wrapper>
  );
};
export default BaseDropdownSelectedOption;

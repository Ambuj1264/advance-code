import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ChildrenAgesDropdown from "./ChildrenAgesDropdown";

import { Trans } from "i18n";
import { typographySubtitle2, typographyCaption } from "styles/typography";
import { gutters, greyColor } from "styles/variables";
import { Namespaces } from "shared/namespaces";

const ChildrenAgesWrapper = styled.div`
  margin-top: ${gutters.large}px;
`;
const HeaderWrapper = styled.div([
  typographySubtitle2,
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
]);

const NameWrapper = styled.div`
  display: flex;
`;

const Name = styled.div([
  typographyCaption,
  css`
    color: ${greyColor};
    white-space: pre-line;
  `,
]);
const ChildrenAges = ({
  childrenAges,
  updateChildrenAges,
  namespace = Namespaces.accommodationNs,
  minAge,
  maxAge,
}: {
  childrenAges: number[];
  updateChildrenAges: (value: number, index: number) => void;
  namespace?: Namespaces;
  minAge?: number;
  maxAge?: number;
}) => {
  return (
    <ChildrenAgesWrapper>
      <HeaderWrapper>
        <NameWrapper>
          <Name>
            <Trans ns={namespace}>
              {childrenAges.length > 1
                ? "What are the ages of the children you are travelling with?"
                : "What is the age of the child you are travelling with?"}
            </Trans>
          </Name>
        </NameWrapper>
      </HeaderWrapper>
      {childrenAges.map((child, index) => (
        <ChildrenAgesDropdown
          key={index.toString()}
          id={index}
          selectedValue={child}
          onChange={(value: number) => {
            return updateChildrenAges(value, index);
          }}
          minAge={minAge}
          maxAge={maxAge}
          namespace={namespace}
        />
      ))}
    </ChildrenAgesWrapper>
  );
};

export default ChildrenAges;

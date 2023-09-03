import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { capitalize } from "utils/globalUtils";
import { gutters, whiteColor, borderRadiusSmall } from "styles/variables";
import { container, mqMin, skeletonPulse } from "styles/base";
import Arrow from "components/icons/arrow-down.svg";
import { typographySubtitle2, typographyOverline } from "styles/typography";

const Wrapper = styled.div``;

const Container = styled.div`
  position: relative;
  ${mqMin.medium} {
    ${container}
  }
`;

const DisplayValue = styled.label<{
  isOpen: boolean;
}>(({ isOpen, theme }) => [
  typographySubtitle2,
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: ${borderRadiusSmall};
    width: 100%;
    height: 45px;
    padding: 0 ${gutters.small}px;
    background-color: ${isOpen ? theme.colors.action : rgba(theme.colors.action, 0.1)};
    cursor: pointer;
    color: ${isOpen ? whiteColor : theme.colors.action};
    fill: ${isOpen ? whiteColor : theme.colors.action};
  `,
]);

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleText = styled.div(
  typographyOverline,
  css`
    margin-right: ${gutters.small / 2}px;
    text-transform: capitalize;
  `
);
const Input = styled.input`
  margin: 0;
  width: 0;
  height: 0;
  visibility: hidden;
`;

const ArrowIcon = styled(Arrow)`
  width: 8px;
  height: 8px;
`;

const ContentWrapper = styled.div`
  margin: 0 ${gutters.large}px;
`;

const LoadingContainer = styled.div`
  margin: ${gutters.large}px ${gutters.large}px 0 ${gutters.large}px;
`;

const DropdownLoading = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small / 2}px;
    height: 45px;
  `,
]);

const ContentCollapsible = ({
  id,
  displayValue,
  toggleText,
  isContentOpen,
  toggleIsContentOpen,
  isLoading = false,
  children,
}: {
  id: string;
  displayValue: React.ReactElement | React.ReactElement[];
  toggleText?: string;
  isContentOpen: boolean;
  toggleIsContentOpen: () => void;
  isLoading?: boolean;
  children: React.ReactElement | React.ReactElement[];
}) => {
  if (isLoading)
    return (
      <LoadingContainer>
        <DropdownLoading />
      </LoadingContainer>
    );
  return (
    <Wrapper>
      <Container>
        <Input
          type="checkbox"
          checked={isContentOpen}
          onChange={toggleIsContentOpen}
          id={`toggle${capitalize(id)}Input`}
        />
        <DisplayValue isOpen={isContentOpen} htmlFor={`toggle${capitalize(id)}Input`}>
          {displayValue}
          <ToggleWrapper>
            <ToggleText>{toggleText}</ToggleText>
            <ArrowIcon
              css={css`
                transform: rotate(${isContentOpen ? "180deg" : "0deg"});
              `}
            />
          </ToggleWrapper>
        </DisplayValue>
        {isContentOpen && <ContentWrapper>{children}</ContentWrapper>}
      </Container>
    </Wrapper>
  );
};

export default ContentCollapsible;

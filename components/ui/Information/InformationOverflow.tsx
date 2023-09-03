import React, { useCallback } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import Arrow from "@travelshift/ui/icons/arrow.svg";

import {
  borderRadiusSmall,
  greyColor,
  gutters,
  borderRadius,
  boxShadowWhiteTop,
} from "styles/variables";
import { typographyCaption, typographyBody2 } from "styles/typography";
import { mqMin } from "styles/base";
import Row from "components/ui/Grid/Row";
import useToggle from "hooks/useToggle";

const ArrowIcon = styled(Arrow)(
  ({ theme }) =>
    css`
      width: auto;
      height: 20px;
      fill: ${theme.colors.primary};
    `
);

const Content = styled.div(
  typographyBody2,
  css`
    padding: 0 ${gutters.large / 2}px;
    ${mqMin.large} {
      height: auto;
      padding: 0 ${gutters.large}px;
      overflow-y: visible;
    }
  `
);

const HiddenInput = styled.input`
  display: none;
`;

const RowWrapper = styled.div`
  ${Row} {
    display: block;
    overflow-y: hidden;

    /* Note: the line-height is either 16 or 24 pixels, so in order not to cut off text, keep the height as a multiple of either */
    /* stylelint-disable-next-line order/properties-order */
    ${HiddenInput} ~ & {
      height: 240px;
    }
    /* stylelint-disable-next-line selector-max-type */
    ${HiddenInput}:checked ~ & {
      height: auto;
    }
    ${mqMin.large} {
      overflow-y: visible;
    }
  }
`;

const InfoToggle = styled.label(
  ({ theme }) => css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: ${gutters.small / 2}px;
    border-radius: ${borderRadius};
    width: 100%;
    padding: ${gutters.small}px;
    background-color: ${rgba(theme.colors.primary, 0.05)};

    &:before {
      content: "";
      position: absolute;
      top: -${gutters.small / 2}px;
      box-shadow: ${boxShadowWhiteTop};
      width: 100%;
      height: 8px;
      padding-top: ${gutters.small}px;
    }
    ${mqMin.large} {
      display: none;
    }
    ${ArrowIcon} {
      transform: rotate(90deg);
    }
    /* stylelint-disable-next-line selector-max-type */
    ${HiddenInput}:checked ~ & ${ArrowIcon} {
      transform: rotate(-90deg);
    }
  `
);

type WrapperProps = {
  shouldInfoOverflow: boolean;
};

const Wrapper = styled.div<WrapperProps>(({ theme, shouldInfoOverflow }) => [
  typographyCaption,
  css`
    color: ${greyColor};
    p {
      margin-top: ${gutters.small}px;
      margin-bottom: 0;
      text-align: justify;
      /* stylelint-disable-next-line selector-max-type */
      :first-of-type {
        margin-top: 0;
      }
    }
    /* stylelint-disable-next-line selector-max-type */
    a {
      color: ${theme.colors.primary};
    }
    ${mqMin.large} {
      border: 1px solid ${rgba(greyColor, 0.1)};
      border-radius: ${borderRadiusSmall};
      height: 312px;
      padding: ${gutters.large}px 0;
      overflow-x: hidden;
      overflow-y: ${shouldInfoOverflow ? "scroll" : "hidden"};
    }
  `,
]);

const InformationOverflow = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const [shouldInfoOverflow, showInfoOverflow] = useToggle(false);
  const wrapperId = `${id}toggleInfoContent`;
  const inputId = `${id}toggleInfo`;
  const handleArrowClick = useCallback(() => {
    if (shouldInfoOverflow) {
      document.getElementById(wrapperId)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [shouldInfoOverflow, wrapperId]);

  return (
    <Wrapper
      shouldInfoOverflow={shouldInfoOverflow}
      onClick={() => shouldInfoOverflow === false && showInfoOverflow()}
    >
      <HiddenInput type="checkbox" id={inputId} />
      <RowWrapper>
        <Row>
          <Content id={wrapperId}>{children}</Content>
        </Row>
      </RowWrapper>

      <InfoToggle htmlFor={inputId} onClick={handleArrowClick}>
        <ArrowIcon />
      </InfoToggle>
    </Wrapper>
  );
};

export default InformationOverflow;

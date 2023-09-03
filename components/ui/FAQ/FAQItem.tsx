import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import ArrowIcon from "@travelshift/ui/icons/arrow.svg";

import { mqMin, mqMax } from "styles/base";
import {
  whiteColor,
  gutters,
  blackColor,
  greyColor,
  fontWeightSemibold,
  borderRadiusCircle,
} from "styles/variables";
import { typographySubtitle1 } from "styles/typography";

const FAQItemTitle = styled.h3([
  typographySubtitle1,
  css`
    margin-bottom: ${gutters.small / 2}px;
    color: ${rgba(blackColor, 0.7)};
    ${mqMin.large} {
      margin-bottom: ${gutters.small / 2}px;
    }
  `,
]);

const FAQItemDescription = styled.div(
  ({ theme }) =>
    css`
      display: block;
      color: ${greyColor};
      line-height: 28px;
      br {
        content: "";
        display: block;
        height: 2px;
      }
      a {
        color: ${theme.colors.primary};
        font-weight: ${fontWeightSemibold};
      }
      ${mqMax.large} {
        overflow: hidden;
      }
    `
);

const InputCheckboxState = styled.input`
  display: none;
`;

const StyledArrowIcon = styled(ArrowIcon, { shouldForwardProp: () => false })(
  ({ theme }) => css`
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease-in-out;
    fill: ${theme.colors.primary};
    ${mqMin.large} {
      display: none;
    }
  `
);

const ButtonContentWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ExpandButton = styled.label(
  ({ theme }) => css`
    position: absolute;
    right: 0;
    left: 0;
    display: block;
    margin: auto;
    border: 1px solid ${theme.colors.primary};
    border-radius: ${borderRadiusCircle};
    width: 32px;
    height: 32px;
    padding-top: ${gutters.small / 4}px;
    background: ${whiteColor};
    ${mqMin.large} {
      display: none;
    }
  `
);

const FAQItemWrapper = styled.div<{ faqId: string }>(
  ({ faqId }) => css`
    position: relative;
    z-index: 0;

    ${FAQItemDescription} {
      ${mqMax.large} {
        max-height: 91px;
      }
    }
    #${faqId}:checked ~ ${FAQItemDescription} {
      ${mqMax.large} {
        max-height: 100%;
      }
    }
    ${StyledArrowIcon} {
      margin-top: -2px;
      transform: rotate(90deg);
    }
    #${faqId}:checked ~ ${ExpandButton} ${StyledArrowIcon} {
      margin-top: -${gutters.small / 4}px;
      transform: rotate(270deg);
    }
  `
);

export const FAQItem = ({
  title,
  description,
  id,
}: {
  title: string;
  description: string;
  id: number;
}) => {
  const faqId = `faqItem${id}`;
  return (
    <FAQItemWrapper faqId={faqId}>
      <FAQItemTitle
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <InputCheckboxState id={faqId} type="checkbox" />
      <FAQItemDescription
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: description.replace(/$/gm, "<br>") }}
      />
      <ExpandButton htmlFor={faqId}>
        <ButtonContentWrapper>
          <StyledArrowIcon />
        </ButtonContentWrapper>
      </ExpandButton>
    </FAQItemWrapper>
  );
};

export default FAQItem;

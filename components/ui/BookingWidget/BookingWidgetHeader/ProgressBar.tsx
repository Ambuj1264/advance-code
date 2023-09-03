import React, { Fragment } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import BaseCheckMark from "@travelshift/ui/icons/checkmark.svg";

import { greyColor, whiteColor, gutters, zIndex } from "styles/variables";
import { mediaQuery } from "styles/base";
import { typographyCaption, typographyOverline } from "styles/typography";

type Props = {
  steps: string[];
  currentStep: number;
};

type ProgressBorderProps = {
  isFinishedStep: boolean;
};

type ProgressStepProps = {
  isActiveOrFinishedStep: boolean;
};

const CheckMark = styled(BaseCheckMark)`
  width: 8px;
  min-width: 8px;
  height: auto;
  fill: ${whiteColor};
`;

const Label = styled.span`
  position: absolute;
  top: ${gutters.large}px;
  width: 90px;
  text-align: center;
`;

const ProgressBorder = styled.div<ProgressBorderProps>(({ theme, isFinishedStep }) => [
  css`
    flex: 1;
    height: 2px;
    background-color: ${isFinishedStep ? theme.colors.action : rgba(greyColor, 0.5)};
    :last-of-type {
      display: none;
    }
  `,
]);

const IconWrapper = styled.div<ProgressStepProps>(({ theme, isActiveOrFinishedStep }) => [
  typographyOverline,
  css`
    display: inline-block;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    background-color: ${isActiveOrFinishedStep ? theme.colors.action : rgba(greyColor, 0.5)};
    color: ${whiteColor};
    letter-spacing: 0px;
    text-align: center;
  `,
]);

const StepWrapper = styled.div<ProgressStepProps>(({ theme, isActiveOrFinishedStep }) => [
  css`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 32px;
    color: ${isActiveOrFinishedStep ? theme.colors.action : rgba(greyColor, 0.5)};
  `,
]);

const ProgressBarWrapper = styled.div(
  ({ theme }) => `
  position: fixed;
  z-index: ${zIndex.max};
  width: 100%;
  background-color: ${whiteColor};
  &::before {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: ${rgba(theme.colors.primary, 0.05)};
  }
`
);

const ProgressBarContainer = styled.div`
  flex-shrink: 0;
  height: 48px;
`;

const Wrapper = styled.div([
  typographyCaption,
  mediaQuery({ margin: [`0 ${gutters.large * 2}px`] }),
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 ${gutters.large * 2}px;
    height: 48px;
    padding-bottom: ${gutters.small / 2}px;
  `,
]);

const ProgressBar = ({ steps, currentStep }: Props) => (
  <ProgressBarContainer>
    <ProgressBarWrapper>
      <Wrapper>
        {steps.map((step: string, index: number) => {
          const isFinishedStep = index < currentStep;
          const isCurrentStep = index === currentStep;
          return (
            <Fragment key={step}>
              <StepWrapper isActiveOrFinishedStep={isFinishedStep || isCurrentStep}>
                <IconWrapper isActiveOrFinishedStep={isFinishedStep || isCurrentStep}>
                  {isFinishedStep ? <CheckMark /> : <span>{index + 1}</span>}
                </IconWrapper>
                <Label>{step}</Label>
              </StepWrapper>
              <ProgressBorder isFinishedStep={isFinishedStep} />
            </Fragment>
          );
        })}
      </Wrapper>
    </ProgressBarWrapper>
  </ProgressBarContainer>
);

export default ProgressBar;

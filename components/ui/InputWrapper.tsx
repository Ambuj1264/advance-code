import React, { ReactChild } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import InformationTooltip from "./Tooltip/InformationTooltip";

import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters, blackColor, redColor } from "styles/variables";
import { typographyBody2, typographyCaption } from "styles/typography";
import { errorAsterisk } from "styles/base";

export const Label = styled.label<{
  isRequired: boolean;
}>(({ isRequired }) => [
  typographyBody2,
  isRequired && errorAsterisk,
  css`
    color: ${rgba(blackColor, 0.7)};
  `,
]);

export const InputError = styled.span([
  typographyCaption,
  css`
    position: absolute;
    align-self: flex-end;
    margin-top: 4px;
    color: ${redColor};
    text-align: right;
  `,
]);

const Container = styled.div`
  position: relative;
  width: 100%;
  & + & {
    margin-top: ${gutters.large / 2}px;
  }
`;

const InformationTooltipWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  .infoButton {
    margin-left: 0;
    height: 100%;
    svg {
      margin-bottom: ${gutters.small / 4}px;
    }
  }
`;

const LabelElement = ({
  id,
  label,
  required,
  InfoTooltipText,
}: {
  id: string;
  label: string;
  required: boolean;
  InfoTooltipText?: string;
}) => {
  if (InfoTooltipText) {
    return (
      <InformationTooltipWrapper>
        <InformationTooltip direction="right" information={InfoTooltipText} />
        <Label isRequired={required} htmlFor={id}>
          {label}
        </Label>
      </InformationTooltipWrapper>
    );
  }
  return (
    <Label isRequired={required} htmlFor={id}>
      {label}
    </Label>
  );
};

const InputWrapper = ({
  className,
  id,
  label,
  hasError = false,
  required = false,
  children,
  customErrorMessage,
  InfoTooltipText,
}: {
  className?: string;
  id: string;
  label: string;
  hasError?: boolean;
  required?: boolean;
  customErrorMessage?: string;
  children: ReactChild;
  InfoTooltipText?: string;
}) => {
  return (
    <Container className={className}>
      {label && (
        <LabelElement required={required} id={id} label={label} InfoTooltipText={InfoTooltipText} />
      )}
      {children}
      {hasError && (
        <InputError data-testid="errorMessage">
          {customErrorMessage || (
            <Trans ns={Namespaces.tourBookingWidgetNs}>Fields with * are required</Trans>
          )}
        </InputError>
      )}
    </Container>
  );
};

export default InputWrapper;

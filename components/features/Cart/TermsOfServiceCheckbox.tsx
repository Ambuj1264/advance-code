import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Checkbox from "components/ui/Inputs/Checkbox";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { InputError } from "components/ui/InputWrapper";

const TermsLink = styled.a(
  ({ theme }) => css`
    color: ${theme.colors.primary};
    &:hover {
      text-decoration: underline;
    }
  `
);

const LabelContainer = styled.span`
  display: flex;
  flex-direction: column;
`;

const StyledInputError = styled(InputError)`
  position: absolute;
  top: 24px;
  left: 0;
`;

const TermsOfServiceCheckbox = ({
  termsAgreed,
  handleChange,
  hasError,
  onTermsClick,
  className,
}: {
  termsAgreed: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTermsClick: () => void;
  hasError: boolean;
  className?: string;
}) => {
  const { t } = useTranslation(Namespaces.cartNs);
  const { t: commonT } = useTranslation();
  return (
    <Checkbox
      className={className}
      hasError={hasError}
      id="termsAgreed"
      label={
        <LabelContainer>
          <span>
            {t("I agree to the")}{" "}
            <TermsLink
              onClick={event => {
                event.stopPropagation();
                event.preventDefault();
                onTermsClick();
              }}
            >
              {t("terms of service")}
            </TermsLink>
          </span>
          {hasError && (
            <StyledInputError data-testid="errorMessage">
              {commonT("Field is required")}
            </StyledInputError>
          )}
        </LabelContainer>
      }
      checked={termsAgreed}
      onChange={(checked: boolean) =>
        handleChange({
          target: {
            type: "checkbox",
            checked,
            name: "termsAgreed",
          },
        } as any)
      }
      name="termsAgreed"
    />
  );
};

export default TermsOfServiceCheckbox;

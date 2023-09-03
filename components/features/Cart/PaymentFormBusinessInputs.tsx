import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { Column } from "./sharedCartComponents";

import Checkbox from "components/ui/Inputs/Checkbox";
import Input from "components/ui/Inputs/Input";
import InputWrapper from "components/ui/InputWrapper";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { column, mqMin } from "styles/base";
import { gutters } from "styles/variables";
import { emptyFunction } from "utils/helperUtils";

export const CheckboxWrapper = styled.div([
  column({ small: 1 }),
  css`
    display: flex;
    justify-content: flex-start;
    margin-top: ${gutters.small / 2}px;
    margin-bottom: ${gutters.small / 2}px;
    ${mqMin.large} {
      margin-bottom: ${gutters.small}px;
    }
  `,
]);

export const CheckBoxContainer = styled.div<{ isRightPadded: boolean }>(({ isRightPadded }) => [
  css`
    width: unset;
    ${mqMin.large} {
      width: 50%;
    }
  `,
  isRightPadded &&
    css`
      padding-left: unset;

      ${mqMin.large} {
        padding-left: ${gutters.large / 2}px;
      }
    `,
]);

const LeftElementContainer = styled.div`
  width: 50%;
`;

const BusinessInputWrapper = styled.div<{ isBusinessTraveller: boolean }>(
  ({ isBusinessTraveller }) => css`
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    flex-wrap: wrap;

    align-items: stretch;
    justify-content: flex-start;
    margin-top: 0;

    ${mqMin.large} {
      margin-top: ${isBusinessTraveller ? gutters.large : 0}px;
    }
  `
);

const PaymentFormBusinessInputs = ({
  isBusinessTraveller,
  companyName,
  companyNamePlaceholder,
  companyIdPlaceholder,
  companyAddressPlaceholder,
  companyAddress,
  handleBlur,
  handleChange,
  companyId,
  className,
  leftElement,
  isReadOnly = false,
}: {
  isBusinessTraveller: boolean;
  companyName: string;
  companyNamePlaceholder?: string;
  companyId: string;
  companyIdPlaceholder?: string;
  companyAddressPlaceholder?: string;
  companyAddress?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  leftElement?: ReactNode;
  isReadOnly?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.orderNs);
  const { t: cartT } = useTranslation(Namespaces.cartNs);
  return (
    <BusinessInputWrapper className={className} isBusinessTraveller={isBusinessTraveller}>
      {isBusinessTraveller && (
        <>
          <Column>
            <InputWrapper label={t("Company name")} id="companyName" hasError={false}>
              <Input
                id="companyName"
                name="companyName"
                placeholder={companyNamePlaceholder}
                value={companyName}
                onChange={handleChange}
                error={false}
                onBlur={handleBlur}
                autocomplete="organization"
                useDebounce={false}
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </InputWrapper>
          </Column>
          <Column>
            <InputWrapper label={t("Company ID")} id="companyId" hasError={false}>
              <Input
                id="companyId"
                name="companyId"
                placeholder={companyIdPlaceholder}
                value={companyId}
                onChange={handleChange}
                error={false}
                onBlur={handleBlur}
                useDebounce={false}
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </InputWrapper>
          </Column>
          <Column large={1}>
            <InputWrapper label={t("Company address")} id="companyAddress" hasError={false}>
              <Input
                id="companyAddress"
                name="companyAddress"
                placeholder={companyAddressPlaceholder}
                value={companyAddress}
                onChange={handleChange}
                error={false}
                onBlur={handleBlur}
                useDebounce={false}
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </InputWrapper>
          </Column>
        </>
      )}
      <CheckboxWrapper>
        {leftElement && <LeftElementContainer>{leftElement}</LeftElementContainer>}
        <CheckBoxContainer isRightPadded={Boolean(leftElement)}>
          <Checkbox
            id="isBusinessTraveller"
            label={cartT("Travelling for work")}
            checked={isBusinessTraveller}
            onChange={
              isReadOnly
                ? emptyFunction
                : (checked: boolean) =>
                    handleChange({
                      target: {
                        type: "checkbox",
                        checked,
                        name: "isBusinessTraveller",
                      },
                    } as React.ChangeEvent<HTMLInputElement>)
            }
            name="isBusinessTraveller"
            readonly={isReadOnly}
          />
        </CheckBoxContainer>
      </CheckboxWrapper>
    </BusinessInputWrapper>
  );
};

export default PaymentFormBusinessInputs;

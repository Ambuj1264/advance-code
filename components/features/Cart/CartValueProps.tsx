import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import ShieldIcon from "components/icons/check-shield.svg";
import LockIcon from "components/icons/lock-2.svg";
import CreditCardIcon from "components/icons/credit-card-check.svg";
import CreditCardNo from "components/icons/credit-card-cross.svg";
import { ValuePropsWrapper } from "components/ui/FrontValuePropositions/FrontValuePropositionsShared";
import ErrorBoundary from "components/ui/ErrorBoundary";
import ProductPropositions from "components/ui/ProductPropositions";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { mqMin } from "styles/base";
import { borderRadiusSmall, gutters } from "styles/variables";
import { typographyCaptionSmall } from "styles/typography";

const StyledValuePropsWrapper = styled(ValuePropsWrapper)([
  css`
    display: none;
    margin-top: ${gutters.small}px;
    ${mqMin.large} {
      display: block;
      width: 700px;
    }
  `,
]);

export const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  margin-top: ${gutters.small}px;
  width: 100%;
`;

const ValuePropTag = styled(ValuePropsWrapper)(({ theme }) => [
  typographyCaptionSmall,
  css`
    margin: 0 ${gutters.small / 4}px;
    margin-bottom: ${gutters.small / 2}px;
    border-radius: ${borderRadiusSmall};
    padding: ${gutters.small / 4}px;
    background-color: ${rgba(theme.colors.action, 0.05)};
    color: ${theme.colors.action};
  `,
]);

const CartValueProps = ({ isMobileValuePropTags = false }: { isMobileValuePropTags?: boolean }) => {
  const { t } = useTranslation(Namespaces.cartNs);
  const props = [
    {
      title: t("All taxes included"),
      Icon: ShieldIcon,
    },
    {
      title: t("Secure payments"),
      Icon: LockIcon,
    },
    {
      title: t("No credit card fees"),
      Icon: CreditCardIcon,
    },
    {
      title: t("No booking fees"),
      Icon: CreditCardNo,
    },
  ];
  return (
    <ErrorBoundary>
      {isMobileValuePropTags ? (
        <TagWrapper>
          {props.slice(0, 3).map(prop => (
            <ValuePropTag key={prop.title}>{prop.title}</ValuePropTag>
          ))}
        </TagWrapper>
      ) : (
        <StyledValuePropsWrapper>
          <ProductPropositions
            productProps={props}
            maxDesktopColumns={4}
            useTruncationIcon={false}
          />
        </StyledValuePropsWrapper>
      )}
    </ErrorBoundary>
  );
};

export default CartValueProps;

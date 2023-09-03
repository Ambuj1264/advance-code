import React from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { useQuery } from "@apollo/react-hooks";
import { css } from "@emotion/core";

import MarketplaceInformationQuery from "./graphql/MarketplaceInformationQuery.graphql";
import MarketplaceInformationContent from "./MarketplaceInformationContent";
import MarketplaceInformationModal from "./MarketplaceInformationModal";

import { useSettings } from "contexts/SettingsContext";
import Information from "components/icons/information-circle.svg";
import { typographyBody2 } from "styles/typography";
import { greyColor, gutters } from "styles/variables";
import { DefaultMarginTop } from "styles/base";
import CustomerSupportIcon from "components/icons/local-companies.svg";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import useToggle from "hooks/useToggle";
import useActiveLocale from "hooks/useActiveLocale";
import { normalizeGraphCMSLocale } from "utils/helperUtils";

const InformationText = styled.div([
  typographyBody2,
  css`
    display: flex;
    align-items: center;
    color: ${rgba(greyColor, 0.7)};
    & + & {
      margin-top: ${gutters.small / 2}px;
      margin-left: 0px;
    }
  `,
]);

const Wrapper = styled.div([
  DefaultMarginTop,
  css`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
  `,
]);

const iconStyles = css`
  margin-right: ${gutters.small / 4}px;
  width: 14px;
  height: 14px;
  fill: ${rgba(greyColor, 0.7)};
`;

const InformationIcon = styled(Information)(
  ({ theme }) =>
    css`
      width: 12px;
      height: 12px;
      fill: ${theme.colors.primary};
    `
);

const IconWrapper = styled.div`
  z-index: 1;
  display: flex;
  align-items: center;
  margin-left: ${gutters.small / 2}px;
`;

const MarketplaceInformation = ({ showContent = false }: { showContent?: boolean }) => {
  const locale = useActiveLocale();
  const isMobile = useIsMobile();
  const { marketplaceUrl } = useSettings();
  const [isModalOpen, toggleModal] = useToggle(false);
  const { error, data, loading } = useQuery<{
    values: OrderTypes.MarketplaceInformation;
  }>(MarketplaceInformationQuery, {
    variables: {
      url: marketplaceUrl,
      locale: normalizeGraphCMSLocale(locale),
    },
  });
  if (!data || error || loading) return null;
  const { helpCenterTimePeriod, contactEmail, phoneNumbers } = data.values;
  if (isMobile && !showContent) {
    return (
      <>
        <Wrapper>
          <InformationText>
            <CustomerSupportIcon css={iconStyles} />
            {helpCenterTimePeriod.value}
            <IconWrapper onClick={() => toggleModal()}>
              <InformationIcon />
            </IconWrapper>
          </InformationText>
        </Wrapper>
        {isModalOpen && (
          <MarketplaceInformationModal
            contactEmail={contactEmail}
            helpCenterTimePeriod={helpCenterTimePeriod.value}
            phoneNumbers={phoneNumbers}
            onClose={toggleModal}
          />
        )}
      </>
    );
  }
  return (
    <MarketplaceInformationContent
      contactEmail={contactEmail}
      helpCenterTimePeriod={helpCenterTimePeriod.value}
      phoneNumbers={phoneNumbers}
    />
  );
};

export default MarketplaceInformation;

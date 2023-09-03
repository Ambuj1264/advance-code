import React from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { combineMediaQueries, DefaultMarginTop, mqMin, mqPrint } from "styles/base";
import EmailIcon from "components/icons/email.svg";
import CustomerSupportIcon from "components/icons/local-companies.svg";
import { gutters, greyColor } from "styles/variables";
import { typographyCaption, typographyBody2 } from "styles/typography";
import { useTranslation } from "i18n";

const InformationText = styled.div([
  css`
    ${typographyBody2}
    display: flex;
    align-items: center;
    color: ${rgba(greyColor, 0.7)};
    & + & {
      margin-top: ${gutters.small}px;
      margin-left: 0px;
    }
    ${combineMediaQueries(mqPrint, mqMin.large)} {
      ${typographyCaption}
      color: ${rgba(greyColor, 0.4)};
      & + & {
        margin-top: 0px;
        margin-left: ${gutters.small}px;
      }
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
    ${combineMediaQueries(mqPrint, mqMin.large)} {
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  `,
]);

const iconStyles = css`
  margin-right: ${gutters.small}px;
  width: 20px;
  height: 20px;
  fill: ${rgba(greyColor, 0.7)};
  ${combineMediaQueries(mqPrint, mqMin.large)} {
    margin-right: ${gutters.small / 2}px;
    width: 12px;
    height: 12px;
    fill: ${rgba(greyColor, 0.4)};
  }
`;

const StyledLink = styled.a(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    color: ${theme.colors.primary};
    ${combineMediaQueries(mqPrint, mqMin.large)} {
      color: ${rgba(greyColor, 0.4)};
    }
  `
);

const FlagImage = styled.img`
  margin-right: ${gutters.small}px;
  border-radius: 2px;
  width: 20px;
  ${combineMediaQueries(mqPrint, mqMin.large)} {
    margin-right: ${gutters.small / 2}px;
    width: 16px;
  }
`;

const CountryCode = styled.span`
  margin: 0 4px;
`;

const PhoneNumbers = ({ phoneNumbers }: { phoneNumbers: OrderTypes.MarketplacePhoneNumber[] }) => {
  const { t } = useTranslation();
  return (
    <>
      {phoneNumbers.map(phoneNumber => (
        <InformationText key={phoneNumber.phone}>
          {phoneNumber.country[0].flag && (
            <FlagImage
              alt={phoneNumber.country[0].flag.name}
              src={phoneNumber.country[0].flag.url}
            />
          )}
          {phoneNumber.country[0].alpha2Code === "EU" && (
            <FlagImage
              alt={phoneNumber.country[0].alpha2Code}
              src="https://media.graphassets.com/eBU4kXVKT3yGVM9wYra9"
            />
          )}
          {phoneNumber.isTollFree && t("Toll free")}
          <CountryCode>{phoneNumber.country[0].alpha2Code}</CountryCode>
          <StyledLink href={`tel:${phoneNumber.phone}`}>{phoneNumber.phone}</StyledLink>
        </InformationText>
      ))}
    </>
  );
};

const MarketplaceInformation = ({
  contactEmail,
  helpCenterTimePeriod,
  phoneNumbers,
}: {
  contactEmail: string;
  helpCenterTimePeriod: string;
  phoneNumbers: OrderTypes.MarketplacePhoneNumber[];
}) => {
  return (
    <>
      <Wrapper>
        <InformationText>
          <CustomerSupportIcon css={iconStyles} />
          {helpCenterTimePeriod}
        </InformationText>
        <InformationText>
          <EmailIcon css={iconStyles} />
          <StyledLink href={`mailto:${contactEmail}`}>{contactEmail}</StyledLink>
        </InformationText>
        {phoneNumbers.length === 1 && <PhoneNumbers phoneNumbers={phoneNumbers} />}
      </Wrapper>
      <Wrapper>{phoneNumbers.length > 1 && <PhoneNumbers phoneNumbers={phoneNumbers} />}</Wrapper>
    </>
  );
};

export default MarketplaceInformation;

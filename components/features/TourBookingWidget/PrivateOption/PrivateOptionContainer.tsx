import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import ToggleButton from "components/ui/Inputs/ToggleButton";
import InformationTooltip, {
  InformationCircleIcon,
} from "components/ui/Tooltip/InformationTooltip";
import Tooltip from "components/ui/Tooltip/Tooltip";
import CarIcon from "components/icons/car.svg";
import { typographyBody2 } from "styles/typography";
import { gutters, fontWeightSemibold, greyColor, blackColor } from "styles/variables";
import { singleLineTruncation } from "styles/base";
import { getPrivateOptionPricePerPerson } from "components/features/TourBookingWidget/utils/tourBookingWidgetUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import currencyFormatter from "utils/currencyFormatUtils";

const PrivateOptionWrapper = styled.div``;

const OptionList = styled.ul`
  margin: 0;
  margin-top: ${gutters.large}px;
  padding: 0;
  list-style-type: none;
`;

const OptionItem = styled.li`
  margin-top: ${gutters.large}px;
`;

const OptionHeader = styled.div([
  typographyBody2,
  ({ theme }) => css`
    display: flex;
    align-items: center;
    color: ${rgba(blackColor, 0.7)};

    ${InformationCircleIcon} {
      fill: ${rgba(theme.colors.primary, 0.5)};
    }
  `,
]);

const InformationCircleWrapperButton = styled.button`
  margin-left: ${gutters.small / 3}px;
  width: 14px;
  height: 22px;
`;

const Option = styled.div([
  typographyBody2,
  singleLineTruncation,
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${rgba(102, 102, 102, 0.5)};
    border-radius: 4px;
    height: 45px;
    padding: 0 ${gutters.small}px;
    color: ${greyColor};
  `,
]);

const CarIconStyled = styled(CarIcon)`
  margin-right: auto;
  width: 16px;
  height: 14px;
  fill: ${greyColor};
`;

const OptionText = styled.div`
  margin-right: auto;
  justify-self: center;
`;

const PrivateToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${gutters.large}px;
`;

const DescriptionWrapper = styled.div([
  typographyBody2,
  css`
    display: flex;
    flex-direction: column;
    margin-right: auto;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const Question = styled.p(
  ({ theme }) => css`
    ${InformationCircleIcon} {
      fill: ${rgba(theme.colors.primary, 0.5)};
    }
  `
);

const PricePerPersonWrapper = styled.div`
  color: ${greyColor};
`;

const Price = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.action};
    font-weight: ${fontWeightSemibold};
  `
);

const PrivateOptionContainer = ({
  isPrivate,
  privateOptions,
  togglePrivateState,
  numberOfTravelers,
}: {
  isPrivate: boolean;
  privateOptions: TourBookingWidgetTypes.PrivateOption[];
  togglePrivateState: () => void;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
}) => {
  const { t: commonNsT } = useTranslation(Namespaces.commonNs);
  const { t: tourBookingWidgetNsT } = useTranslation(Namespaces.tourBookingWidgetNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();

  if (privateOptions.length === 0) {
    return null;
  }

  const pricePerPerson = getPrivateOptionPricePerPerson(privateOptions, numberOfTravelers);
  const formattedPricePerPerson = currencyFormatter(convertCurrency(pricePerPerson));

  return (
    <PrivateOptionWrapper>
      <PrivateToggleWrapper>
        <DescriptionWrapper>
          <Tooltip
            title={tourBookingWidgetNsT(
              "By selecting this option your group get’s a private vehicle with a private guide."
            )}
            direction="right"
          >
            <Question>
              <Trans ns={Namespaces.tourBookingWidgetNs}>
                Would you like to make this tour private?
              </Trans>
              <InformationCircleWrapperButton type="button">
                <InformationCircleIcon />
              </InformationCircleWrapperButton>
            </Question>
          </Tooltip>
          {privateOptions.length > 0 && (
            <PricePerPersonWrapper>
              <Price>{`${formattedPricePerPerson} ${currencyCode}`}</Price> /{" "}
              <Trans ns={Namespaces.tourBookingWidgetNs}>Per person</Trans>
            </PricePerPersonWrapper>
          )}
        </DescriptionWrapper>
        <ToggleButton
          checked={isPrivate}
          onChange={togglePrivateState}
          onValue={commonNsT("Yes")}
          offValue={commonNsT("No")}
          id="privateOptionToggle"
        />
      </PrivateToggleWrapper>
      {isPrivate && (
        <OptionList>
          {privateOptions.map((option, index) => (
            // could be two similar options, no unique data
            // eslint-disable-next-line react/no-array-index-key
            <OptionItem key={index}>
              <OptionHeader>
                <Trans
                  ns={Namespaces.tourBookingWidgetNs}
                  i18nKey="Vehicle {vehicleIndex}"
                  defaults="Vehicle {vehicleIndex}"
                  values={{ vehicleIndex: index + 1 }}
                />
                <InformationTooltip
                  information={tourBookingWidgetNsT(
                    "Your group get’s a private vehicle with a private guide throughout the whole tour."
                  )}
                  direction="right"
                />
              </OptionHeader>
              <Option>
                <CarIconStyled />
                <OptionText>
                  <Trans
                    ns={Namespaces.tourBookingWidgetNs}
                    i18nKey="Private vehicle with {numberOfSeats} seats"
                    defaults="Private vehicle with {numberOfSeats} seats"
                    values={{ numberOfSeats: option.travellers }}
                  />
                </OptionText>
              </Option>
            </OptionItem>
          ))}
        </OptionList>
      )}
    </PrivateOptionWrapper>
  );
};

export default PrivateOptionContainer;

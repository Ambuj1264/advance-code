import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import { useTranslation } from "react-i18next";
import { useQueryParams } from "use-query-params";

import ModalTravelDetails from "./ModalTravelDetails/ModalTravelDetails";

import CarMultiplePickupLocationsPicker from "components/features/Car/CarBookingWidget/CarMultiplePickupLocationsPicker";
import CarQueryParamsScheme from "components/features/Car/queryParams/carQueryParamsScheme";
import { gutters, blackColor, separatorColorLight, borderRadiusSmall } from "styles/variables";
import CalendarDropdownDisplay from "components/ui/DatePicker/CalendarDropdownDisplay";
import { typographyBody2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import LoadingDropdown from "components/ui/Loading/LoadingDropdown";
import LoadingHeader from "components/ui/Loading/LoadingHeader";
import useToggle from "hooks/useToggle";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";

const Wrapper = styled.div``;

const FieldWrapper = styled.div`
  margin-top: ${gutters.small}px;
`;

const Label = styled.div([
  typographyBody2,
  css`
    color: ${rgba(blackColor, 0.7)};
  `,
]);

export const DoubleLabel = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: nowrap;
  ${Label} {
    width: 50%;
  }
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${gutters.small / 2}px;
  border: 1px solid ${separatorColorLight};
  border-radius: ${borderRadiusSmall};
  padding: ${gutters.small / 4}px 0;
`;

export const ClickableDateField = styled(Field)`
  padding: ${gutters.small / 4}px 0;
  cursor: pointer;
`;

const HeadingWrapper = styled.div`
  margin: ${gutters.large}px -${gutters.large}px 0 -${gutters.large}px;
`;

const TravelDetailsLoading = () => (
  <Wrapper>
    <HeadingWrapper>
      <LoadingHeader />
    </HeadingWrapper>
    <LoadingDropdown withHeader />
    <LoadingDropdown withHeader />
    <LoadingDropdown withHeader />
  </Wrapper>
);

const TravelDetailsDesktop = ({
  from,
  to,
  loading,
  searchPageUrl,
  availableLocations,
}: {
  from: string;
  to: string;
  loading: boolean;
  searchPageUrl: string;
  availableLocations?: CarTypes.AvailableLocation[];
}) => {
  const { t } = useTranslation(Namespaces.carBookingWidgetNs);
  const [isModalOpen, toggleModal] = useToggle();
  const [queryParams, setQueryParams] = useQueryParams(CarQueryParamsScheme);
  return (
    <>
      {isModalOpen && <ModalTravelDetails onClose={toggleModal} searchPageUrl={searchPageUrl} />}
      {loading ? (
        <TravelDetailsLoading />
      ) : (
        <Wrapper>
          <FieldWrapper>
            <CarMultiplePickupLocationsPicker
              singleLocationsLabel={<Label>{t("Pick-up & Drop-off location")}</Label>}
              doubleLocationsLabel={
                <DoubleLabel>
                  <Label>{t("Pick-up location")}</Label>
                  <Label>{t("Drop-off location")}</Label>
                </DoubleLabel>
              }
              locations={availableLocations}
              selectedLocationOfferId={queryParams.secondOfferId}
              onAfterLocationSelect={location =>
                setQueryParams(
                  {
                    secondOfferId: location.idContext,
                  },
                  QueryParamTypes.PUSH_IN
                )
              }
            />
          </FieldWrapper>
          <FieldWrapper>
            <DoubleLabel>
              <Label>{t("Pick-up date")}</Label>
              <Label>{t("Drop-off date")}</Label>
            </DoubleLabel>
            <ClickableDateField onClick={toggleModal}>
              <CalendarDropdownDisplay from={from} to={to} />
            </ClickableDateField>
          </FieldWrapper>
        </Wrapper>
      )}
    </>
  );
};

export default TravelDetailsDesktop;

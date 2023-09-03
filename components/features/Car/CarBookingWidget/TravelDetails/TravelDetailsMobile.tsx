import React, { useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useQueryParams } from "use-query-params";
import { useTranslation } from "react-i18next";

import CarBookingWidgetCallbackContext from "../contexts/CarBookingWidgetCallbackContext";
import { BookingWidgetView } from "../../types/CarEnums";

import { ClickableDateField, DoubleLabel } from "./TravelDetailsDesktop";

import CarMultiplePickupLocationsPicker from "components/features/Car/CarBookingWidget/CarMultiplePickupLocationsPicker";
import CarQueryParamsScheme from "components/features/Car/queryParams/carQueryParamsScheme";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { guttersPx } from "styles/variables";
import { typographyCaptionSemibold } from "styles/typography";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { Namespaces } from "shared/namespaces";
import CalendarDropdownDisplay from "components/ui/DatePicker/CalendarDropdownDisplay";
import { useGlobalContext } from "contexts/GlobalContext";

const Row = styled.div(
  () => css`
    margin: ${guttersPx.small} 0;
  `
);

const Label = styled.div(
  [typographyCaptionSemibold],
  css`
    width: 100%;
  `
);

const TravelDetailsMobile = ({
  from,
  to,
  availableLocations,
}: {
  from: string;
  to: string;
  availableLocations?: CarTypes.AvailableLocation[];
}) => {
  const { t } = useTranslation(Namespaces.carBookingWidgetNs);
  const { isMobileSearchWidgetBtnClicked } = useGlobalContext();
  const { setBookingWidgetView } = useContext(CarBookingWidgetCallbackContext);
  const [queryParams, setQueryParams] = useQueryParams(CarQueryParamsScheme);
  return (
    <>
      <MobileSectionHeading>{t("Travel details")}</MobileSectionHeading>
      <Row>
        <CarMultiplePickupLocationsPicker
          locations={availableLocations}
          singleLocationsLabel={<Label>{t("Pick-up & Drop-off location")}</Label>}
          doubleLocationsLabel={
            <DoubleLabel>
              <Label>{t("Pick-up location")}</Label>
              <Label>{t("Drop-off location")}</Label>
            </DoubleLabel>
          }
          selectedLocationOfferId={queryParams.secondOfferId}
          onAfterLocationSelect={location =>
            setQueryParams(
              {
                secondOfferId: location.idContext,
              },
              QueryParamTypes.PUSH_IN
            )
          }
          isMobileSearchWidgetBtnClicked={isMobileSearchWidgetBtnClicked}
        />
      </Row>
      <Row>
        <DoubleLabel>
          <Label>{t("Pick-up date")}</Label>
          <Label>{t("Drop-off date")}</Label>
        </DoubleLabel>
        <ClickableDateField onClick={() => setBookingWidgetView(BookingWidgetView.Dates)}>
          <CalendarDropdownDisplay from={from} to={to} />
        </ClickableDateField>
      </Row>
    </>
  );
};

export default TravelDetailsMobile;

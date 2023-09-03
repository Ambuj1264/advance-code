import React from "react";
import styled from "@emotion/styled";

import { useStayBookingWidgetContext } from "../StayBookingWidgetStateContext";
import { getAccommodationTitle } from "../utils/stayBookingWidgetUtils";

import NoAvailability from "./StayNoAvailability";
import AvailabilityLoading from "./AvailabilityLoading";
import StayRoomCombinations from "./StayRoomCombinations";
import StayRoomTypes from "./StayRoomTypes";

import BookingWidgetSectionHeading from "components/ui/BookingWidget/BookingWidgetSectionHeading";
import MediaQuery from "components/ui/MediaQuery";
import { DisplayType } from "types/enums";
import { gutters } from "styles/variables";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const HeadingWrapper = styled.div`
  margin: ${gutters.large}px -${gutters.large}px 0 -${gutters.large}px;
`;

const StayAvailabilityContainer = ({
  categoryId,
  productTitle,
  productId,
}: {
  categoryId?: number;
  productTitle?: string;
  productId: number;
}) => {
  const { selectedDates, roomCombinations, roomTypes, isAvailabilityLoading } =
    useStayBookingWidgetContext();

  if (!selectedDates.to || !selectedDates.from) return null;
  const title = getAccommodationTitle(categoryId);
  const hideTitle = false;
  if (isAvailabilityLoading) return <AvailabilityLoading />;
  if (roomCombinations.length === 0 && roomTypes.length === 0) {
    return <NoAvailability productId={productId} productTitle={productTitle} />;
  }
  return (
    <>
      <MediaQuery fromDisplay={DisplayType.Large}>
        {!hideTitle && (
          <HeadingWrapper>
            <BookingWidgetSectionHeading color="primary">
              <Trans ns={Namespaces.accommodationNs}>{title}</Trans>
            </BookingWidgetSectionHeading>
          </HeadingWrapper>
        )}
      </MediaQuery>
      <StayRoomTypes />
      <StayRoomCombinations />
    </>
  );
};

export default StayAvailabilityContainer;

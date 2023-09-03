import React, { useState } from "react";
import styled from "@emotion/styled";
import Head from "next/head";

import MobileStepDoubleLocation from "../MobileSteps/MobileStepDoubleLocation";

import useCarPickupLocationQuery from "./useCarPickupLocationQuery";
import { CallbackContext } from "./contexts/CarSearchWidgetCallbackContext";
import DriverInformationMobile from "./DriverInformation/DriverInformationMobile";
import { getCarAutocompleteOptions, getPlaceTypeByPlaceId } from "./utils/carSearchWidgetUtils";
import TimePickerMobile from "./TimePickerMobile";

import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const Wrapper = styled.div`
  margin-bottom: 65px;
`;

export const StyledPickupInfoMobileSectionHeading = styled(MobileSectionHeading)();

const PickupInfoMobile = ({
  times,
  pickupName,
  pickupId,
  dropoffName,
  dropoffId,
  pickupAvailableTime,
  dropoffAvailableTime,
  onPickupLocationChange,
  onDropoffLocationChange,
  onPickupTimeChange,
  onDropoffTimeChange,
  driverAge,
  setDriverAge,
  driverCountry,
  setDriverCountry,
  className,
  forceFocusOrigin,
  forceFocusDestination,
}: {
  times: SharedCarTypes.CarSeachTimes;
  pickupAvailableTime?: SharedTypes.AvailableTime;
  dropoffAvailableTime?: SharedTypes.AvailableTime;
  driverAge: number;
  setDriverAge: (driverAge: string) => void;
  driverCountry?: string;
  setDriverCountry: (driverCountry: string) => void;
  pickupName?: string;
  pickupId?: string;
  dropoffName?: string;
  dropoffId?: string;
  className?: string;
  forceFocusOrigin?: boolean;
  forceFocusDestination?: boolean;
} & Pick<
  CallbackContext,
  | "onPickupLocationChange"
  | "onDropoffLocationChange"
  | "onPickupTimeChange"
  | "onDropoffTimeChange"
>) => {
  const { t } = useTranslation(Namespaces.commonSearchNs);
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const { data: originData } = useCarPickupLocationQuery({
    searchQuery: originInput,
    type: "From",
  });
  const { data: destinationData } = useCarPickupLocationQuery({
    searchQuery: destinationInput,
    type: "To",
  });
  const originPlaceholder = t("City, Airport, station, region, district");
  const destinationPlaceholder = t("City, Airport, station, region, district");
  const originLocations = originData
    ? getCarAutocompleteOptions(originData.availableLocations.locations)
    : undefined;
  const destinationLocations = destinationData
    ? getCarAutocompleteOptions(destinationData.availableLocations.locations)
    : undefined;
  const defaultOriginAutocompleteIconType = pickupName
    ? getPlaceTypeByPlaceId(pickupId)
    : getPlaceTypeByPlaceId();
  const defaultDestinationAutocompleteIconType = dropoffName
    ? getPlaceTypeByPlaceId(dropoffId)
    : getPlaceTypeByPlaceId();
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          key="viewport"
        />
      </Head>
      <Wrapper className={className}>
        <StyledPickupInfoMobileSectionHeading>
          {t("Select details")}
        </StyledPickupInfoMobileSectionHeading>
        <MobileStepDoubleLocation
          originId="pickupLocation"
          destinationId="dropoffLocation"
          onOriginLocationChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setOriginInput(e.target.value);
          }}
          onDestinationLocationChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDestinationInput(e.target.value);
          }}
          defaultOrigin=""
          defaultDestination=""
          origin={pickupName}
          destination={dropoffName}
          originLabel={t("Pick-up location")}
          destinationLabel={t("Drop-off location")}
          originLocations={originLocations}
          destinationLocations={destinationLocations}
          originPlaceholder={originPlaceholder}
          destinationPlaceholder={destinationPlaceholder}
          defaultOriginAutocompleteIconType={defaultOriginAutocompleteIconType}
          defaultDestinationAutocompleteIconType={defaultDestinationAutocompleteIconType}
          originInput={originInput}
          destinationInput={destinationInput}
          onOriginItemClick={onPickupLocationChange}
          onDestinationItemClick={onDropoffLocationChange}
          forceFocusOrigin={forceFocusOrigin}
          forceFocusDestination={forceFocusDestination}
        />
        <TimePickerMobile
          times={times}
          pickupAvailableTime={pickupAvailableTime}
          dropoffAvailableTime={dropoffAvailableTime}
          onPickupTimeChange={onPickupTimeChange}
          onDropoffTimeChange={onDropoffTimeChange}
        />
        <DriverInformationMobile
          driverAge={driverAge}
          setDriverAge={setDriverAge}
          driverCountry={driverCountry}
          setDriverCountry={setDriverCountry}
        />
      </Wrapper>
    </>
  );
};

export default PickupInfoMobile;

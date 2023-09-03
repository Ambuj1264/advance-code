import React, { useContext } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";

import { BubblesWrapper } from "./TripPlannerStyledComponents";
import TripPlannerStateContext from "./contexts/TripPlannerStateContext";

import {
  borderRadius,
  gutters,
  separatorColorDark,
  textColorLight,
  fontSizeBody1,
} from "styles/variables";
import { mqMin } from "styles/base";

const IframeContainer = styled.div`
  position: relative;
  display: block;
  margin: ${gutters.large}px auto;
  border: 1px solid ${separatorColorDark};
  border-radius: ${borderRadius};
  height: 100%;
  min-height: 300px;
  background-color: ${rgba(separatorColorDark, 0.5)};
  color: ${textColorLight};
  font-size: ${fontSizeBody1};
  text-align: center;
  overflow: hidden;

  ${mqMin.large} {
    margin: 0 auto;
  }
`;

const BackdropWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border-width: 0;
`;

const BubblesWrapperColumn = styled(BubblesWrapper)`
  flex-direction: column;

  span {
    max-height: 30px;
  }
`;

const TripPlannerMap = ({
  isLoading,
  theme,
  fetchError,
}: {
  isLoading?: boolean;
  theme: Theme;
  fetchError: string;
}) => {
  const { selectedTrip, noDataError } = useContext(TripPlannerStateContext);
  return (
    <IframeContainer>
      {!selectedTrip || !selectedTrip.mapUrl ? (
        <>
          {!isLoading && !fetchError.length && !noDataError.length && (
            <BackdropWrapper>
              <p>
                {`Set the parameters available and click on "Get travel
              plan" to create your trips.`}
              </p>
              <p>
                {`Once we're done fetching the data, the map will appear
              here.`}
              </p>
            </BackdropWrapper>
          )}
          {isLoading && (
            <BubblesWrapperColumn>
              <Bubbles theme={theme} size="small" color="primary" />
              <p>Fetching content, please wait.</p>
            </BubblesWrapperColumn>
          )}
          {noDataError.length && (
            <BackdropWrapper>
              <p>{noDataError}</p>
            </BackdropWrapper>
          )}
          {fetchError.length && (
            <BackdropWrapper>
              <p>Something went wrong with generating the trip</p>
              <p>{fetchError}</p>
            </BackdropWrapper>
          )}
        </>
      ) : (
        <Iframe className="lazyload" height="310" data-src={selectedTrip.mapUrl} allowFullScreen />
      )}
    </IframeContainer>
  );
};

export default TripPlannerMap;

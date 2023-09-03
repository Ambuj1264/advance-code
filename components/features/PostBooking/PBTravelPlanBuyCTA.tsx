import React from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import {
  StyledContainer,
  TravelplanContentWrapper,
  PBHeading,
} from "./components/PBSharedComponents";

import { PageType, SupportedLanguages } from "types/enums";
import { mqMax } from "styles/base";
import Map from "components/features/PostBooking/images/travelPlanMap.svg";
import MapMobile from "components/features/PostBooking/images/travelPlanMapMobile.svg";
import { borderRadius, guttersPx, whiteColor } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { MaxWidthWrapper } from "components/features/PostBooking/components/MaxWidthWrapper";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { ProductCardActionButton } from "components/ui/ProductCard/ProductCardActionButton";
import { typographySubtitle2 } from "styles/typography";
import { getClientSideUrl } from "utils/helperUtils";
import { useSettings } from "contexts/SettingsContext";

const MapWrapper = styled.div`
  margin-bottom: ${guttersPx.large};
  border-radius: ${borderRadius};
  height: 358px;
  overflow: hidden;
  ${mqMax.large} {
    margin: 0 auto ${guttersPx.large};
    width: 100%;
    max-width: 360px;
    height: 502px;
  }
`;

const ProductCardActionButtonStyled = styled(ProductCardActionButton)(({ theme }) => [
  typographySubtitle2,
  css`
    width: 100%;
    background-color: ${theme.colors.action};
    color: ${whiteColor};
    ${mqMax.large} {
      margin: 0 auto;
      width: 100%;
      max-width: 360px;
    }
  `,
]);

const PBTravelPlanBuyCTA = () => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const isMobile = useIsMobile();
  const { marketplace } = useSettings();
  return (
    <TravelplanContentWrapper>
      <StyledContainer>
        <MaxWidthWrapper>
          <PBHeading>
            {postbookingT(
              "You have no upcoming travel plans. Book vacation packages to get the best travel plans."
            )}
          </PBHeading>
          <MapWrapper>{isMobile ? <MapMobile /> : <Map />}</MapWrapper>
          <ProductCardActionButtonStyled
            title={
              isMobile
                ? postbookingT("See vacation packages!")
                : postbookingT("Book your vacation package now!")
            }
            clientRoute={{
              as: `${getClientSideUrl(
                "vacationPackages",
                SupportedLanguages.English, // TODO: use real locale when we have vp search for all locales
                marketplace
              )}`,
              route: `/${PageType.VACATION_PACKAGES_LANDING}`,
            }}
          />
        </MaxWidthWrapper>
      </StyledContainer>
    </TravelplanContentWrapper>
  );
};

export default PBTravelPlanBuyCTA;

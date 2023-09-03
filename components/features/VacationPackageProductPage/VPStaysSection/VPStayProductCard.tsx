import React, { useContext } from "react";
import styled from "@emotion/styled";

import VPProductCard from "../VPProductCard";
import VPCardBanner from "../VPCardBanner";
import { VPActiveModalTypes } from "../contexts/VPModalStateContext";
import { constructStaysQuickFacts, getVPModalProductId } from "../utils/vacationPackageUtils";
import { VPStayStateContext } from "../contexts/VPStayStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import VPStaysInfoModalContent from "./VPStaysInfoModalContent";
import VPStaysEditModalContent from "./VPStaysEditModalContent";

import { StyledSimilarProductsColumn } from "components/ui/ProductCardRow";
import { Namespaces } from "shared/namespaces";
import TwoStars from "components/icons/rating-two-stars.svg";
import ThreeStars from "components/icons/rating-three-star.svg";
import FourStars from "components/icons/rating-four-star.svg";
import FiveStars from "components/icons/rating-five-star.svg";
import HotelIcon from "components/icons/house-heart.svg";
import { useTranslation } from "i18n";
import { constructGraphCMSImage } from "components/ui/LandingPages/utils/landingPageUtils";
import { GraphCMSPageType } from "types/enums";
import { getTotalNumberOfGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import { singleLineTruncation } from "styles/base";
import Tooltip from "components/ui/Tooltip/Tooltip";

const SelectedRoomText = styled.div([singleLineTruncation]);

const StyledTooltip = styled(Tooltip)`
  max-width: 222px;
`;

const iconByRating: { [rating: number]: React.ElementType } = {
  2: TwoStars,
  3: ThreeStars,
  4: FourStars,
  5: FiveStars,
};

const renderHotelRatingIcon = (rating: number): React.ElementType => {
  return iconByRating[rating];
};

const VPStayProductCard = ({
  stay,
  day,
  productsCount,
  stayIndex,
}: {
  stay: VacationPackageTypes.VacationPackageStayProduct;
  day: number;
  productsCount: number;
  stayIndex: number;
}) => {
  const { t: accommodationT } = useTranslation(Namespaces.accommodationNs);
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const { onSelectVPStayProduct } = useContext(VPActionCallbackContext);
  const { occupancies, selectedHotelsRooms } = useContext(VPStayStateContext);
  const totalGuests = getTotalNumberOfGuests(occupancies);
  const productName = stay.name ?? "";
  const strProductId = String(stay.productId);
  const selectedHotelRooms = selectedHotelsRooms.find(
    item => item.productId === stay.productId && item.groupedWithDays.some(date => date === day)
  );
  const roomType = selectedHotelRooms?.roomCombinations.find(room => room.isSelected)?.title ?? "";
  const isProductSelected = Boolean(selectedHotelRooms);
  const hasStarClass = stay?.starClass >= 2;
  const stayImage = constructGraphCMSImage(GraphCMSPageType.Stays, stay?.mainImage);
  return (
    <StyledSimilarProductsColumn
      key={`${stay.productId}-${day}-${String(stayIndex)}`}
      productsCount={productsCount}
    >
      <VPProductCard
        headline={productName}
        image={stayImage}
        onSelectCard={(productId: string) => onSelectVPStayProduct(day, productId)}
        productId={strProductId}
        modalProductId={getVPModalProductId(day, stay.productId)}
        productSpecs={constructStaysQuickFacts(stay, totalGuests, accommodationT)}
        averageRating={stay.rating}
        reviewsCount={stay.userRatingsTotal}
        imageLeftBottomContent={
          hasStarClass && (
            <VPCardBanner
              bannerContent={vacationPackageT(`{starClass}-star`, {
                starClass: stay.starClass,
              })}
              Icon={renderHotelRatingIcon(stay.starClass)}
              isSelected={isProductSelected}
            />
          )
        }
        includeReviews
        isCardSelected={isProductSelected}
        editModalContent={
          <VPStaysEditModalContent
            day={day}
            productId={stay.productId}
            roomCombinations={selectedHotelRooms ? selectedHotelRooms.roomCombinations : []}
          />
        }
        isFormEditModal
        infoModalContent={
          <VPStaysInfoModalContent
            attractionsConditions={{
              latitude: stay.lat,
              longitude: stay.lng,
            }}
            productId={stay.productId}
            searchUrl=""
            queryCondition={{
              stayProductId: stay.productId,
            }}
          />
        }
        includedFooterTextContent={
          <StyledTooltip title={roomType} alwaysTop>
            <SelectedRoomText>{roomType}</SelectedRoomText>
          </StyledTooltip>
        }
        price={stay.vpPrice}
        radioButtonValue={productName}
        editModalTitle={{
          Icon: HotelIcon,
          title: productName,
        }}
        infoModalTitle={{
          Icon: HotelIcon,
          title: productName,
        }}
        editModalId={VPActiveModalTypes.EditStay}
        infoModalId={VPActiveModalTypes.InfoStay}
      />
    </StyledSimilarProductsColumn>
  );
};

export default VPStayProductCard;

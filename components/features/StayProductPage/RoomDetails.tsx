import React from "react";
import styled from "@emotion/styled";

import IconList from "components/ui/IconList/IconList";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import GridRow from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";
import { gutters, breakpointsMin, borderRadiusLarger } from "styles/variables";
import ImageCarousel from "components/ui/ImageCarousel/ImageCarousel";
import { ImageWrapper } from "components/ui/ImageCarousel/ImageSlide";
import { mqMin } from "styles/base";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import ImagePlaceholder from "components/ui/Image/ImagePlaceholder";

const StyledImageColumn = styled(Column)`
  margin-top: ${gutters.small}px;
`;

const StyledImagePlaceholder = styled(ImagePlaceholder)`
  border-radius: ${borderRadiusLarger};
`;

const StyledImageCarousel = styled(ImageCarousel)`
  ${ImageWrapper} {
    height: 248px;
    img {
      border-radius: ${borderRadiusLarger};
    }
  }
`;

const RightSectionContent = styled.div`
  margin-top: ${gutters.large / 2}px;
`;

const BottomSectionContent = styled.div`
  margin-top: ${gutters.small}px;
  margin-bottom: ${gutters.large}px;
  ${mqMin.large} {
    margin-top: ${gutters.large / 2}px;
  }
`;

const RoomDetails = ({
  id,
  roomTypeName,
  images,
  productSpecs,
  roomDetails,
}: {
  id: string;
  roomTypeName: string;
  images: Image[];
  productSpecs: SharedTypes.ProductSpec[];
  roomDetails: SharedTypes.Icon[];
}) => {
  return (
    <GridRow>
      <StyledImageColumn columns={{ small: 1, large: 2 }}>
        {images.length > 0 ? (
          <StyledImageCarousel
            id={`${id}ModalImages`}
            imageUrls={images}
            showThumbnails={false}
            hideModalGallery
            height={248}
            lazy
            className={`${id}ModalImages`}
            sizes={`(min-width: ${breakpointsMin.max}px) ${(breakpointsMin.max * 3) / 12}px, 100vw`}
          />
        ) : (
          <StyledImagePlaceholder imageHeight={248} />
        )}
      </StyledImageColumn>
      <Column columns={{ small: 1, large: 2 }}>
        <RightSectionContent>
          <LeftSectionHeading>{roomTypeName}</LeftSectionHeading>
          <IconList
            sectionId={`room${id}Details`}
            iconList={
              (productSpecs.map(fact => ({
                id: fact.value,
                title: fact.value,
                Icon: fact.Icon,
              })) as SharedTypes.Icon[]) ?? []
            }
            iconLimit={8}
            inGrid
            columns={{ small: 2 }}
          />
        </RightSectionContent>
      </Column>
      <Column columns={{ small: 1 }}>
        {roomDetails.length > 0 && (
          <BottomSectionContent>
            <LeftSectionHeading>
              <Trans ns={Namespaces.accommodationNs}>Room details</Trans>
            </LeftSectionHeading>
            <IconList
              sectionId={`room${id}Details`}
              inGrid
              columns={{ small: 2, large: 4 }}
              iconList={roomDetails}
            />
          </BottomSectionContent>
        )}
      </Column>
    </GridRow>
  );
};

export default RoomDetails;

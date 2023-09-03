import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import ImageCarousel from "../../ImageCarousel/ImageCarousel";

import Modal, {
  ModalHeader,
  CloseButton,
  ModalContentWrapper,
  ModalBodyContainer,
} from "components/ui/Modal/Modal";
import useToggle from "hooks/useToggle";
import InformationIcon from "components/icons/information-circle.svg";
import { typographySubtitle1 } from "styles/typography";
import {
  whiteColor,
  borderRadiusSmall,
  boxShadow,
  gutters,
  breakpointsMin,
  loadingBlue,
} from "styles/variables";
import { row, column } from "styles/base";

const Heading = styled.div(({ theme }) => [
  typographySubtitle1,
  css`
    color: ${theme.colors.primary};
    text-align: center;
  `,
]);

export const Carousel = styled.div<{ isSingleItem: boolean }>(
  ({ isSingleItem }) =>
    css`
      position: relative;
      height: ${isSingleItem ? 272 : 210}px;
      background-color: ${loadingBlue};
    `
);

const Content = styled.div`
  position: relative;
  padding: ${gutters.large / 2}px;
`;

const Column = styled.div<{ isSingleItem: boolean }>(
  ({ isSingleItem }) =>
    css`
      ${column({ small: 1, medium: isSingleItem ? 1 / 2 : 1 })};
    `
);

const Row = styled.div(row);

const CardWrapper = styled.div`
  box-shadow: ${boxShadow};
  border-radius: ${borderRadiusSmall};
  width: 100%;
  min-height: 210px;
  background-color: ${whiteColor};
  overflow: hidden;
`;

const StyledInformationIcon = styled(InformationIcon)(
  ({ theme }) => css`
    width: 18px;
    height: 18px;
    fill: ${theme.colors.primary};
  `
);

const InformationButtonWrapper = styled.div`
  position: absolute;
  right: ${gutters.small / 2}px;
  bottom: ${gutters.small / 2}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  background-color: ${whiteColor};
`;

const ItemCard = ({
  id,
  name,
  images,
  isSingleItem = false,
  children,
  className,
  hideModalGallery = false,
  lazyLoading = true,
  imageSizes = `(min-width: ${breakpointsMin.max}px) ${(breakpointsMin.max * 3) / 12}px, 100vw`,
  additionalInformation,
}: {
  id: string;
  name?: string;
  images: Image[];
  isSingleItem?: boolean;
  children: React.ReactNode;
  className?: string;
  hideModalGallery?: boolean;
  lazyLoading?: boolean;
  imageSizes?: string;
  additionalInformation?: React.ReactNode;
}) => {
  const [isModalOpen, toggleModal] = useToggle(false);
  return (
    <>
      <CardWrapper className={className}>
        <Row>
          <Column isSingleItem={isSingleItem}>
            <Carousel isSingleItem={isSingleItem}>
              <ImageCarousel
                id={id}
                imageUrls={images}
                showThumbnails={false}
                sizes={imageSizes}
                hideModalGallery={hideModalGallery}
                lazy={lazyLoading}
              />
              {additionalInformation && (
                <InformationButtonWrapper onClick={toggleModal}>
                  <StyledInformationIcon />
                </InformationButtonWrapper>
              )}
            </Carousel>
          </Column>
          <Column isSingleItem={isSingleItem}>
            <Content>
              {name && <Heading>{name}</Heading>}
              {children}
            </Content>
          </Column>
        </Row>
      </CardWrapper>
      {isModalOpen && (
        <Modal id={`${id}Modal`} onClose={toggleModal} variant="info" wide noMinHeight>
          <ModalHeader rightButton={<CloseButton onClick={toggleModal} />} />
          <ModalContentWrapper>
            <ModalBodyContainer>{additionalInformation}</ModalBodyContainer>
          </ModalContentWrapper>
        </Modal>
      )}
    </>
  );
};
export default ItemCard;

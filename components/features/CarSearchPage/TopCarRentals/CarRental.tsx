import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters, boxShadow, borderRadiusSmall, greyColor, whiteColor } from "styles/variables";
import { column, mqMin } from "styles/base";
import ReviewSummaryNoLeafs from "components/ui/ReviewSummary/ReviewSummaryNoLeafs";
import { useIsDesktop } from "hooks/useMediaQueryCustom";
import LazyImage from "components/ui/Lazy/LazyImage";
import { typographySubtitle2 } from "styles/typography";
import Arrow from "components/icons/arrow-circle.svg";

const CarRentalWrapper = styled.div([
  column({ small: 1 / 2, medium: 1 / 3, large: 1 / 3 }),
  css`
    margin-bottom: ${gutters.small}px;
    ${mqMin.large} {
      margin-bottom: ${gutters.large}px;
    }
  `,
]);

const CarRentalContainer = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: ${boxShadow};
  border-radius: ${borderRadiusSmall};
  height: 204px;
  padding: ${gutters.small / 2}px;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  border-radius: 50%;
  width: 80px;
  overflow: hidden;
`;

const imageStyles = css`
  border-radius: 50%;
  width: auto;
  height: 80px;
`;

const SeeMoreWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${gutters.large}px;
`;

const ArrowIcon = styled(Arrow)(
  ({ theme }) => css`
    margin-left: ${gutters.small / 2}px;
    width: 20px;
    height: 20px;
    fill: ${theme.colors.action};
  `
);

const SeeMoreText = styled.div([
  typographySubtitle2,
  css`
    color: ${greyColor};
  `,
]);

const CarRental = ({
  url,
  reviewTotalCount,
  reviewTotalScore,
  image,
}: CarSearchTypes.TopCarRental) => {
  const { t } = useTranslation(Namespaces.carSearchNs);
  const isDesktop = useIsDesktop();

  return (
    <CarRentalWrapper>
      <CarRentalContainer href={url}>
        {reviewTotalScore > 0 && (
          <ReviewSummaryNoLeafs
            reviewTotalScore={reviewTotalScore}
            reviewText={
              isDesktop
                ? t("{reviewsCount} company reviews", {
                    reviewsCount: reviewTotalCount,
                  })
                : ""
            }
          />
        )}
        {image && (
          <Logo>
            <LazyImage
              src={image.url}
              imgixParams={{ fit: "clamp", bg: whiteColor }}
              width={80}
              height={80}
              alt={image.name}
              styles={imageStyles}
            />
          </Logo>
        )}
        <SeeMoreWrapper>
          <SeeMoreText>
            <Trans>See more</Trans>
          </SeeMoreText>
          <ArrowIcon />
        </SeeMoreWrapper>
      </CarRentalContainer>
    </CarRentalWrapper>
  );
};

export default CarRental;

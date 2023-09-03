import React from "react";
import styled, { StyledComponent } from "@emotion/styled";
import { css } from "@emotion/core";

import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import LazyImage from "components/ui/Lazy/LazyImage";
import ReviewSummaryScore from "components/ui/ReviewSummary/ReviewSummaryScore";
import ReviewSummaryCount from "components/ui/ReviewSummary/ReviewSummaryCount";
import { getDefaultReviewCountTextTranslation } from "components/ui/ReviewSummary/utils";
import { TeaserImageCard, teaserImageStyles } from "components/ui/Teaser/TeaserComponents";
import { gutters, whiteColor, fontWeightBold } from "styles/variables";
import { typographyBody1, typographyH4, typographyH5 } from "styles/typography";

const TitleHolder = styled.div<{ hasSubtitle: boolean }>(({ hasSubtitle }) => [
  css`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    color: ${whiteColor};
    text-align: left;
  `,
  hasSubtitle
    ? css`
        padding: ${gutters.small / 2}px ${gutters.small}px;
      `
    : css`
        padding: ${gutters.small}px;
      `,
]);

const Subtitle = styled.div(typographyBody1);

export const Title = styled.h3`
  ${typographyH4};
  font-weight: ${fontWeightBold};
`;

const CARD_HEIGHT = 168;

const StyledTeaserImageCard = styled(TeaserImageCard)`
  height: ${CARD_HEIGHT}px;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: block;
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ReviewSummaryWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  padding: ${gutters.small}px;
`;

const ReviewSummaryScoreStyled = styled(ReviewSummaryScore)`
  ${typographyH5};
  z-index: 1;
`;

const ReviewSummaryCountStyled = styled(ReviewSummaryCount)`
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  margin-right: ${gutters.small / 2}px;
`;

const TeaserImageDistanceReview = ({
  url,
  image,
  LinkComponent,
  title,
  subtitle,
  reviewScore,
  reviewsCount,
  isGoogleReview,
}: TeaserTypes.Teaser & {
  LinkComponent?: StyledComponent<{ href: string }, { href: string }, Theme>;
}) => {
  const { t } = useTranslation(Namespaces.commonNs);

  if (!image) {
    return null;
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  const WrapperComponent = ({ children }: { children: React.ReactElement }) =>
    LinkComponent ? <LinkComponent href={url}>{children}</LinkComponent> : children;

  return (
    <WrapperComponent>
      <StyledTeaserImageCard hasShadow>
        <LazyImage
          src={image.url}
          styles={teaserImageStyles}
          alt={image.name}
          height={CARD_HEIGHT}
          width={350}
        />
        <TitleHolder hasSubtitle={!!subtitle}>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleHolder>
        {reviewScore && reviewsCount ? (
          <ReviewSummaryWrapper>
            <ReviewSummaryCountStyled
              reviewTotalScore={reviewScore}
              reviewTotalCount={reviewsCount}
              reviewsCountText={getDefaultReviewCountTextTranslation(
                t,
                reviewsCount,
                isGoogleReview
              )}
              isLink={false}
            />
            <ReviewSummaryScoreStyled reviewTotalScore={reviewScore.toFixed(1)} />
          </ReviewSummaryWrapper>
        ) : null}
      </StyledTeaserImageCard>
    </WrapperComponent>
  );
};

export default TeaserImageDistanceReview;

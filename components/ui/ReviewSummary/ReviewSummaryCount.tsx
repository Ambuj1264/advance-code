import React, { useCallback } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import ReviewStars from "components/ui/ReviewStars";
import { typographyCaption, typographySubtitle2 } from "styles/typography";
import { yellowColor, whiteColor } from "styles/variables";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

export const ReviewTotalCountLink = styled.a([
  typographyCaption,
  css`
    color: ${yellowColor};
    text-decoration: none;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  `,
]);

export const ReviewTotalCountText = styled.span([
  typographySubtitle2,
  css`
    color: ${whiteColor};
  `,
]);

const ReviewSummaryCount = ({
  reviewTotalScore,
  reviewTotalCount,
  reviewsCountText,
  className,
  isLink,
}: {
  reviewTotalScore: number;
  reviewTotalCount: number;
  reviewsCountText?: string;
  isLink: boolean;
  className?: string;
}) => {
  const smoothScrollToTarget = useCallback(event => {
    const elementToScroll = document.querySelector(event.target.hash);
    if (!elementToScroll) {
      return true;
    }

    event.preventDefault();

    elementToScroll?.scrollIntoView({
      behavior: "smooth",
    });

    const shouldUpdateAddressBarHash = window.location.hash !== event.target.hash;
    if (shouldUpdateAddressBarHash) {
      const url = new URL(window.location.href);
      // eslint-disable-next-line functional/immutable-data
      url.hash = event.target.hash;
      window.history.pushState(null, "", url.toString());
    }

    return undefined;
  }, []);

  return (
    <div className={className}>
      <ReviewStars reviewScore={reviewTotalScore} />
      {isLink ? (
        <ReviewTotalCountLink id="readReviews" href="#reviews" onClick={smoothScrollToTarget}>
          <Trans
            ns={Namespaces.commonNs}
            defaults="Read {reviewTotalCount} reviews"
            values={{ reviewTotalCount }}
          />
        </ReviewTotalCountLink>
      ) : (
        <ReviewTotalCountText>
          {reviewsCountText || (
            <Trans
              ns={Namespaces.commonNs}
              defaults="{reviewTotalCount} reviews"
              values={{ reviewTotalCount }}
            />
          )}
        </ReviewTotalCountText>
      )}
    </div>
  );
};

export default ReviewSummaryCount;

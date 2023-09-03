import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { CarouselContainer } from "../Cover";
import { CoverHeader, CoverStyled, CoverDefaultProps } from "../CountryAndArticleSearchPagesCover";

import { Marketplace, SupportedLanguages } from "types/enums";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { mqMin } from "styles/base";
import { useIsDesktop } from "hooks/useMediaQueryCustom";
import useActiveLocale from "hooks/useActiveLocale";
import { gutters } from "styles/variables";
import { useSettings } from "contexts/SettingsContext";
import { useGlobalContext } from "contexts/GlobalContext";

const FrontCoverVideo = CustomNextDynamic(() => import("./FrontCoverVideo"), {
  loading: () => null,
  ssr: false,
});

const FrontCoverStyled = styled(CoverStyled)<{
  shouldHideCoverOnDesktop: boolean;
  hasBreadcrumbs: boolean;
}>(
  css`
    background-color: black;
  `,
  ({ shouldHideCoverOnDesktop }) =>
    shouldHideCoverOnDesktop
      ? css`
          ${CarouselContainer} {
            ${mqMin.desktop} {
              visibility: hidden;
            }
          }
        `
      : css``,
  ({ hasBreadcrumbs }) =>
    hasBreadcrumbs
      ? css``
      : css`
          ${mqMin.large} {
            margin-top: ${gutters.large}px;
          }
        `
);

const FrontCover = ({
  images,
  title,
  description,
  frontVideoId,
  frontVideoStartingTime,
  frontVideoEndTime,
  children,
  loading = false,
  hasBreadcrumbs = false,
  gteFrontPageMobileImageUrl,
}: {
  images: Image[];
  title: string;
  description?: string;
  frontVideoId?: string;
  frontVideoStartingTime?: number;
  frontVideoEndTime?: number;
  children: ReactNode;
  loading?: boolean;
  hasBreadcrumbs?: boolean;
  gteFrontPageMobileImageUrl?: string;
}) => {
  const isDesktop = useIsDesktop();
  const activeLocale = useActiveLocale();
  const isShowVideo = Boolean(frontVideoId && activeLocale !== SupportedLanguages.Chinese);
  const { isClientNavigation } = useGlobalContext();
  const { marketplace } = useSettings();

  const shouldDelayVideoPlayback =
    marketplace === Marketplace.GUIDE_TO_EUROPE && !isClientNavigation.current;

  return (
    <FrontCoverStyled
      {...CoverDefaultProps}
      loading={loading}
      shouldHideCoverOnDesktop={isShowVideo && !shouldDelayVideoPlayback}
      hasBreadcrumbs={hasBreadcrumbs}
      headerComponent={
        <>
          <CoverHeader title={title} description={description}>
            {children}
          </CoverHeader>
          {isDesktop && isShowVideo && (
            <FrontCoverVideo
              videoId={frontVideoId}
              videoStartingTime={frontVideoStartingTime}
              videoEndTime={frontVideoEndTime}
              delayedVideoPlayback={shouldDelayVideoPlayback}
            />
          )}
        </>
      }
      imageUrls={images}
      reduceMobileQuality
      gteFrontPageMobileImageUrl={gteFrontPageMobileImageUrl}
    />
  );
};

export default FrontCover;

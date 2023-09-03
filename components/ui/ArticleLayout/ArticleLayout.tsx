import React, { useCallback, useEffect, useRef, ReactNode, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useMediaQuery } from "react-responsive";

import useFixToPreventEmbeddedMapZoomOnScroll from "./hooks/useFixToPreventEmbeddedMapZoomOnScroll";
import useShowImageGalleryByClickingOnInContentImage from "./hooks/useShowImageGalleryByClickingOnInContentImage";
import ArticleContext, { ArticleContextPatchType } from "./ArticleContext";
import ContentGallery from "./ContentGallery";
import ArticleFAQContainer from "./ArticleFAQContainer";

import { getImgixImageId } from "utils/imageUtils";
import CustomNextDynamic from "lib/CustomNextDynamic";
import CoverTemperatureWidget from "components/ui/Cover/CoverTemperatureWidget/CoverTemperatureWidgetContainer";
import ArticleWidget from "components/ui/ArticleWidget/ArticleWidget";
import Cover from "components/ui/Cover/Cover";
import Row from "components/ui/Grid/Row";
import ProductPropositions from "components/ui/ProductPropositions";
import {
  container,
  containerPaddingsBackward,
  column,
  mediaQuery,
  mqMin,
  mqMax,
} from "styles/base";
import { typographyH3, typographyH5 } from "styles/typography";
import { gutters, borderRadius, breakpointsMax, zIndex } from "styles/variables";
import { CoverVariant, PageType } from "types/enums";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const FBComments = CustomNextDynamic(() => import("components/ui/FBComments"), {
  ssr: false,
  loading: () => null,
});

const STICKY_TOP_OFFSET = 50;

export const H1 = styled.h1<{ textColor: string }>(({ textColor }) => [
  typographyH5,
  css`
    color: ${textColor};
    text-align: center;
    ${mqMin.large} {
      ${typographyH3}
    }
  `,
]);

export const ContentPageWrapper = styled.div([
  container,
  css`
    overflow-wrap: break-word;
  `,
]);

export const CoverMapWrapper = styled.div([
  css`
    ${mqMax.large} {
      overflow: hidden;
      ${containerPaddingsBackward}
    }
  `,
]);

export const MainColumn = styled.div([
  column({
    small: 1,
    medium: 1,
    large: 7 / 12,
  }),
  css`
    align-self: flex-start;
    ${mqMin.large} {
      padding: 0 ${gutters.large + gutters.large / 2}px;
    }
    .table-overflow {
      overflow-x: scroll;
    }
  `,
]);

export const LeftColumn = styled.div([
  column({ small: 2 / 12 }),
  mediaQuery({
    display: ["none", "none", "block"],
  }),
]);

export const RightColumn = styled.div<{ shiftUp?: boolean }>([
  css`
    position: relative;
  `,
  ({ shiftUp }) =>
    shiftUp &&
    mediaQuery({
      top: [0, 0, `-${gutters.large * 2 + gutters.small / 4}px`],
    }),
  column({ small: 3 / 12 }),
  mediaQuery({
    display: ["none", "none", "block"],
  }),
]);

const CoverWrapper = styled.div([
  css`
    overflow: hidden;
    ${mqMax.large} {
      ${containerPaddingsBackward}
    }
  `,
  mediaQuery({
    borderRadius: [0, 0, borderRadius],
  }),
]);

export const ContainerLeftColumn = styled.div<{
  shouldDrawGradient: boolean;
}>(({ shouldDrawGradient }) => [
  css`
    position: sticky;
    top: ${STICKY_TOP_OFFSET}px;
    z-index: 0;
    margin-top: -${gutters.large}px;
    max-height: calc(100vh - ${STICKY_TOP_OFFSET + gutters.large}px);
    overflow: hidden;
  `,
  shouldDrawGradient &&
    css`
      &::after,
      &::before {
        content: "";
        position: absolute;
        left: 0;
        z-index: ${zIndex.z1};
        width: 100%;
        height: ${gutters.large}px;
      }

      &::after {
        top: 0;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 1) 0%,
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 100%
        );
      }

      &::before {
        bottom: 0;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 1) 100%
        );
      }
    `,
]);

/*
 * 17px negative margin-right, and 17px padding-right
 * are for hiding scroll bar.
 * z-index: 0 -> ToC z-index should be lower than contact-us button
 * */
export const TableOfContentHolder = styled.div`
  position: relative;
  z-index: 0;
  margin-right: -17px;
  max-height: calc(100vh - ${STICKY_TOP_OFFSET + gutters.large}px);
  padding: ${gutters.large}px 17px 0 0;
  overflow: auto;
`;

const PropositionWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
  ${mqMax.large} {
    ${containerPaddingsBackward}
  }
`;

const renderWidgets = (widgets?: Array<ArticleWidgetTypes.ArticleWidget>) => {
  if (!widgets) {
    return null;
  }

  return widgets.map((widget, index) => (
    <ArticleWidget
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      widget={widget}
      isFirstWidgetInList={index === 0}
      isLastWidgetInList={index === widgets.length - 1}
    />
  ));
};

export const ArticleCover = ({
  images,
  leftContent,
  rightTopContent,
  rightBottomContent,
}: {
  images: Image[];
  leftContent?: React.ReactNode;
  rightTopContent?: React.ReactNode;
  rightBottomContent?: React.ReactNode;
}) => {
  return (
    <CoverWrapper>
      <Cover
        imageUrls={images}
        height={430}
        variant={CoverVariant.HERO}
        leftContent={leftContent}
        rightTopContent={rightTopContent}
        rightContent={rightBottomContent}
        responsiveThumbnails={{ medium: 5, large: 7, desktop: 9 }}
      />
    </CoverWrapper>
  );
};

export const ContentLayoutHeadingWrapper = styled.div(
  mediaQuery({
    marginTop: [`${gutters.small}px`, `${gutters.large + gutters.small}px`],
  })
);

export const ArticleRow = ({
  left,
  main,
  right,
  className,
}: {
  left?: any;
  main?: any;
  right?: any;
  className?: string;
}) => {
  return (
    <Row className={className}>
      <LeftColumn>{left}</LeftColumn>
      <MainColumn>{main}</MainColumn>
      <RightColumn>{right}</RightColumn>
    </Row>
  );
};

type WidgetsColumn = {
  widgets?: ArticleWidgetTypes.ArticleWidget[];
  before?: any;
  after?: any;
  wrapWidgets?: (children: any) => ReactNode;
  shiftUp?: boolean;
};

export const WrapOldHtml = ({ children, images }: { children: any; images: Image[] }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [galleryImages, setGalleryImages] = useState<ImageWithSizes[]>(images);

  useEffect(
    // parse image sizes from dom and update images[] array which is used for gallery
    function parseGalleryImageSizes() {
      if (!wrapperRef?.current) {
        return;
      }
      const htmlImages: NodeListOf<HTMLImageElement> =
        wrapperRef.current?.querySelectorAll?.("img");
      const galleryImagesWithSizes = [...galleryImages];

      htmlImages?.forEach?.(htmlImage => {
        const imgWidth = Number(htmlImage.getAttribute("width"));
        const imgHeight = Number(htmlImage.getAttribute("height"));

        const src = htmlImage.dataset.src || htmlImage.src;

        if (!src) return;

        const imageElementId = getImgixImageId(src);
        const galleryImageIndex = images.findIndex(galleryImage => {
          return galleryImage.id === imageElementId;
        });

        if (galleryImageIndex !== -1 && galleryImagesWithSizes[galleryImageIndex]) {
          // eslint-disable-next-line functional/immutable-data
          galleryImagesWithSizes[galleryImageIndex].width = imgWidth;
          // eslint-disable-next-line functional/immutable-data
          galleryImagesWithSizes[galleryImageIndex].height = imgHeight;
        }
      });

      setGalleryImages(galleryImagesWithSizes);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images, wrapperRef]
  );

  useEffect(() => {
    if (!wrapperRef.current) return;

    const videos: NodeListOf<HTMLIFrameElement> =
      wrapperRef.current.querySelectorAll("iframe[src*='youtube']");

    const videosArray = Array.from(videos);

    const enableAutoplay = (e: Event, iframe: HTMLIFrameElement) => {
      e.preventDefault();
      iframe.removeAttribute("srcdoc");
      // eslint-disable-next-line functional/immutable-data,no-param-reassign
      iframe.style.pointerEvents = "";
      return false;
    };
    const videosMap = videosArray.map(
      (iframe: HTMLIFrameElement) => (e: Event) => enableAutoplay(e, iframe)
    );

    videosArray.forEach((iframe, index) => {
      // eslint-disable-next-line functional/immutable-data,no-param-reassign
      iframe.style.pointerEvents = "none";

      iframe.parentNode!.addEventListener("click", videosMap[index]);
    });

    // eslint-disable-next-line consistent-return
    return () => {
      videosArray.forEach((iframe, index) => {
        iframe.removeEventListener("click", videosMap[index]);
      });
    };
  }, []);

  const [galleryIndexToShow, setGalleryImageIndexToShow, handleContentImageClick] =
    useShowImageGalleryByClickingOnInContentImage(images);

  const handleContenMapClick = useFixToPreventEmbeddedMapZoomOnScroll(wrapperRef);

  const handleLayoutClick = useCallback(
    (event: React.SyntheticEvent) => {
      handleContentImageClick(event);
      handleContenMapClick(event);
    },
    [handleContentImageClick, handleContenMapClick]
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div ref={wrapperRef} onClick={handleLayoutClick}>
      {children}
      <ContentGallery
        imageUrls={galleryImages}
        galleryImageIndexToShow={galleryIndexToShow}
        showGalleryImage={setGalleryImageIndexToShow}
      />
    </div>
  );
};

export const WidgetsRowWrapper = styled.div([
  mediaQuery({
    marginTop: [`${gutters.small}px`, `${gutters.small + gutters.large}px`],
  }),
]);

export const WidgetsRow = ({
  left,
  main,
  right,
  contextPatch,
}: {
  left: WidgetsColumn;
  main: WidgetsColumn;
  right: WidgetsColumn;
  contextPatch: ArticleContextPatchType;
}) => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const mainContentRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  return (
    <ArticleContext.Provider
      value={
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        {
          ...contextPatch,
          mainContentRef,
          rightColumnRef,
        }
      }
    >
      <Row>
        <LeftColumn>
          {!isMobile && (
            <ContainerLeftColumn shouldDrawGradient={Boolean(left.widgets)}>
              <TableOfContentHolder>
                {left.before}
                {left.wrapWidgets
                  ? left.wrapWidgets(renderWidgets(left.widgets))
                  : renderWidgets(left.widgets)}
                {left.after}
              </TableOfContentHolder>
            </ContainerLeftColumn>
          )}
        </LeftColumn>
        <MainColumn ref={mainContentRef}>
          {main.before}
          {main.wrapWidgets
            ? main.wrapWidgets(renderWidgets(main.widgets))
            : renderWidgets(main.widgets)}
          {main.after}
        </MainColumn>
        <RightColumn shiftUp={right.shiftUp}>
          {/*
            <RightColumn> have 100% height.
            This div to calculate real height of right side bar content
          */}
          <div ref={rightColumnRef}>
            {right.before}
            {right.wrapWidgets
              ? right.wrapWidgets(renderWidgets(right.widgets))
              : renderWidgets(right.widgets)}
            {right.after}
          </div>
        </RightColumn>
      </Row>
    </ArticleContext.Provider>
  );
};

const WidgetsFullWidthWrapper = styled.div`
  margin-top: ${gutters.small * 2}px;
  &:empty {
    margin-top: 0;
  }
  ${mqMin.large} {
    margin-top: ${gutters.large * 2}px;
  }
`;

export const WidgetsFullWidth = ({ widgets }: { widgets: ArticleWidgetTypes.ArticleWidget[] }) => {
  return <WidgetsFullWidthWrapper>{renderWidgets(widgets)}</WidgetsFullWidthWrapper>;
};

export const FacebookComments = ({
  url,
  commentsUrlOverride,
}: {
  url?: string;
  commentsUrlOverride?: string;
}) => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.medium });
  if (isMobile || !url) {
    return null;
  }

  return (
    <LazyComponent lazyloadOffset={LazyloadOffset.Medium}>
      <FBComments likeUrl={url} commentsUrl={commentsUrlOverride || url} />
    </LazyComponent>
  );
};

export const FAQ = ({ slug, pageType }: { slug: string; pageType: string }) => {
  return (
    <LazyHydrateWrapper ssrOnly>
      <ArticleFAQContainer slug={slug} pageType={pageType} />
    </LazyHydrateWrapper>
  );
};

export const Propositions = ({ productProps }: { productProps: SharedTypes.ProductProp[] }) => {
  return (
    <PropositionWrapper>
      <ProductPropositions productProps={productProps} maxDesktopColumns={4} />
    </PropositionWrapper>
  );
};

export const TemperatureWidget = ({ slug, pageType }: { slug: string; pageType: PageType }) => {
  return <CoverTemperatureWidget slug={slug} pageType={pageType} />;
};

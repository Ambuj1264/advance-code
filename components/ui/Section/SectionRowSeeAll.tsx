import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ClientLinkPrefetch from "../ClientLinkPrefetch";

import ArrowRightIcon from "components/icons/arrow-right.svg";
import { PageType } from "types/enums";
import { getProductSlugFromHref } from "utils/routerUtils";
import { urlToRelative } from "utils/apiUtils";
import { gutters } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";

export const SeeAllWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
  line-height: 20px;
  text-align: right;
`;

const ClientLinkPrefetchStyled = styled(ClientLinkPrefetch)(
  ({ theme }) => css`
    ${typographySubtitle2};
    color: ${theme.colors.primary};
  `
);

const ArrowRightIconStyled = styled(ArrowRightIcon)(
  ({ theme }) => css`
    margin-left: ${gutters.small / 2}px;
    width: 12px;
    height: 12px;
    fill: ${theme.colors.primary};
  `
);

const SectionRowSeeAll = ({
  categoryLink,
  categoryLinkTitle,
  categoryLinkPageType = PageType.TOURCATEGORY,
  isLegacyRoute = false,
  className,
}: {
  categoryLink?: string;
  categoryLinkTitle?: string;
  categoryLinkPageType?: PageType;
  isLegacyRoute?: boolean;
  className?: string;
}) => {
  if (categoryLink) {
    return (
      <SeeAllWrapper className={className}>
        <ClientLinkPrefetchStyled
          linkUrl={urlToRelative(categoryLink)}
          useRegularLink={isLegacyRoute}
          clientRoute={{
            query: {
              slug: getProductSlugFromHref(categoryLink),
            },
            route: `/${categoryLinkPageType}`,
            as: urlToRelative(categoryLink),
          }}
          title={categoryLinkTitle}
        >
          {categoryLinkTitle}
          <ArrowRightIconStyled />
        </ClientLinkPrefetchStyled>
      </SeeAllWrapper>
    );
  }
  return null;
};

export default SectionRowSeeAll;

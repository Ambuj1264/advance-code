import React, { ElementType, SyntheticEvent } from "react";
import { useRouter } from "next/router";

import { mockDomainSwitcherLinks } from "components/ui/Map/utils/domainSwitcherMockData";
import { MapOverlayLink, iconStyles, Wrapper } from "components/ui/Map/MapOverlayLinks";
import { BestPlacesPage, PageType } from "types/enums";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";
import PinLocationIcon from "components/icons/pin-location-1.svg";
import Camera1Icon from "components/icons/camera-1.svg";

export const DOMAIN_SWITCHER_TITLES = {
  destinations: "Destinations",
  attractions: "Attractions",
  trips: "Trips",
  stays: "Stays",
  cars: "Cars",
};

type ClientRouteType = {
  route: string;
  as: string;
};

type SearchDomainType = {
  id: BestPlacesPage;
  clientRoute: ClientRouteType;
  Icon: ElementType;
  title: string;
  isRegularLink: boolean;
};

type PageTypeKeys = keyof typeof PageType;
type PageTypeValues = typeof PageType[PageTypeKeys];

// TODO: add routes from API.
const SearchDomainsMap: Partial<{
  [key in PageTypeValues]: SearchDomainType | SearchDomainType[];
}> = {
  [PageType.BEST_PLACES]: [
    {
      id: BestPlacesPage.DESTINATIONS,
      clientRoute: {
        route: `/${PageType.BEST_PLACES}`,
        as: mockDomainSwitcherLinks.destinations,
      },
      Icon: PinLocationIcon,
      title: DOMAIN_SWITCHER_TITLES.destinations,
      isRegularLink: false,
    },
    {
      id: BestPlacesPage.ATTRACTIONS,
      clientRoute: {
        route: `/${PageType.BEST_PLACES}`,
        as: mockDomainSwitcherLinks.attractions,
      },
      Icon: Camera1Icon,
      title: DOMAIN_SWITCHER_TITLES.attractions,
      isRegularLink: false,
    },
  ],
};

const DomainSwitcher = ({
  className,
  pageTypes,
  onItemClick = () => {},
  activeItemId,
}: {
  className?: string;
  pageTypes: PageType[];
  onItemClick?: (pageType: PageType, id: BestPlacesPage) => void;
  activeItemId?: BestPlacesPage;
}) => {
  const { pathname } = useRouter();

  return (
    <Wrapper className={className}>
      {pageTypes.map(pageType => {
        const domainDataValue = SearchDomainsMap[pageType];

        if (!domainDataValue) return null;
        const isArrayType = Array.isArray(domainDataValue);
        const domainData: SearchDomainType[] = isArrayType
          ? (domainDataValue as SearchDomainType[])
          : ([domainDataValue] as SearchDomainType[]);

        return domainData.map(({ clientRoute, Icon, title, isRegularLink, id }) => {
          const isActivePath = pathname === clientRoute.route;
          const isActive = isArrayType ? activeItemId === id : isActivePath && activeItemId === id;

          const handleClick = (event: SyntheticEvent) => {
            if (isArrayType) event.preventDefault();
            onItemClick(pageType, id);
          };

          return (
            <MapOverlayLink
              key={id}
              clientRoute={{
                ...clientRoute,
              }}
              useRegularLink={isArrayType ? true : isRegularLink}
              isActive={isActive}
              onClick={handleClick}
            >
              <Icon css={iconStyles(isActive)} />
              <Trans ns={Namespaces.countryNs}>{title}</Trans>
            </MapOverlayLink>
          );
        });
      })}
    </Wrapper>
  );
};

export default DomainSwitcher;

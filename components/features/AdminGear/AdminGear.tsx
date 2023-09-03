import React, { useCallback } from "react";
import styled from "@emotion/styled";
import getConfig from "next/config";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import isPropValid from "@emotion/is-prop-valid";
import { useRouter } from "next/router";

import { filterAvailableLinks, getCommonAdminLinks } from "./utils";
import IndexingModalContainer from "./IndexingModalContainer";
import SaveCartModal from "./SaveCartModal";
import useHandleCacheClear from "./useHandleCacheClear";
import useSaveCart from "./useSaveCart";
import CreateReservationModal from "./CreateReservationModal";
import useCreateReservation from "./useCreateReservation";
import MarketplaceModals from "./MarketplaceModals";
import useGetTemplate, { TemplateInput } from "./useGetTemplate";

import { isProd } from "utils/globalUtils";
import { ROUTE_NAMES } from "shared/routeNames";
import { Marketplace } from "types/enums";
import { dayMonthYearWithTimeFormat, getFormattedDate } from "utils/dateUtils";
import useSession from "hooks/useSession";
import CogIconSvg from "components/icons/cog.svg";
import LinkIcon from "components/icons/link.svg";
import { zIndex, gutters, whiteColor, blackColor, redColor, greyColor } from "styles/variables";
import { typographyBody2, typographyCaptionSmall } from "styles/typography";
import useToggle from "hooks/useToggle";
import { useSettings } from "contexts/SettingsContext";
import {
  asPathWithoutQueryParams,
  extractPageTypeFromRoute,
  normalizePathForSurrogateKeys,
} from "utils/routerUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { emptyArray } from "utils/constants";

const { isServerless } = getConfig().publicRuntimeConfig;

const getGearColor = (isIndexed: boolean | undefined, theme: Theme): string => {
  if (isIndexed === undefined) {
    return greyColor;
  }
  return `${isIndexed ? theme.colors.action : redColor}`;
};

const Wrapper = styled.div<{ isOpen: boolean }>(
  ({ isOpen }) => css`
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: ${zIndex.max};
    width: 315px;
    background-color: ${rgba(blackColor, 0.8)};
    transform: ${isOpen ? "none" : "translate3d(calc(-100% + 35px), calc(100% - 35px), 0)"};
    transition: transform 0.2s ease;
  `
);

const MenuHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  width: 35px;
  height: 35px;
  padding: ${gutters.small / 2}px;
`;

const CogIcon = styled(CogIconSvg, {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "isIndexed",
})<{ isIndexed: boolean | undefined }>(
  ({ isIndexed, theme }) => css`
    display: block;
    width: 100%;
    path {
      fill: ${getGearColor(isIndexed, theme)};
    }
  `
);

const Menu = styled.div<{ hasInfoText: boolean }>(hasInfoText => [
  typographyBody2,
  css`
    margin-top: ${hasInfoText ? 0 : -10}px;
    padding-bottom: ${gutters.small}px;
    color: ${whiteColor};
  `,
]);

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li`
  word-break: break-word;
  &:hover {
    background-color: ${rgba(blackColor, 0.2)};
  }
  /* stylelint-disable-next-line selector-max-type */
  & > * {
    display: block;
    padding: 0 ${gutters.small}px;
  }
  button {
    color: ${whiteColor};
  }
`;

const IndexedLi = styled(ListItem)<{ isIndexed: boolean }>(
  ({ isIndexed, theme }) => css`
    &,
    &:hover {
      background-color: ${isIndexed ? theme.colors.action : redColor};
    }
  `
);

const InfoText = styled(ListItem)`
  &,
  &:hover {
    background-color: ${greyColor};
  }
`;

const DocumentAge = styled(ListItem)<{}>(
  ({ theme }) => css`
    &,
    &:hover {
      background-color: ${theme.colors.primary};
    }
  `
);

const MenuItemButton = styled.button`
  width: 100%;
  cursor: pointer;
  color: ${whiteColor};
  text-align: left;

  &:disabled {
    cursor: not-allowed;
    color: ${rgba(greyColor, 0.8)};
  }
`;

const CacheClearingButton = styled(MenuItemButton)<{
  isLoading: boolean;
  isSmall?: boolean;
}>(({ theme, isLoading, isSmall }) => [
  css`
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    position: relative;
  `,
  isLoading &&
    css`
      &:disabled:after {
        content: "";
        position: absolute;
        top: calc(50% - 7.5px);
        right: 10px;
        display: block;
        border: 3px solid ${whiteColor};
        border-top: 3px solid ${theme.colors.primary};
        border-radius: 50%;
        width: 15px;
        height: 15px;
        animation: spin 2s linear infinite;
      }
    `,
  isSmall && typographyCaptionSmall,
]);

const SaveCartButton = styled(MenuItemButton)<{ isCartLinkCopied: boolean }>(
  ({ isCartLinkCopied }) => [
    css`
      /* stylelint-disable selector-max-type */
      @keyframes scaleIcon {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.5);
        }
        100% {
          transform: scale(1);
        }
      }

      display: flex;
      justify-content: space-between;

      svg {
        width: 20px;
        opacity: 0;
      }
      path {
        fill: ${whiteColor};
      }
    `,
    isCartLinkCopied &&
      css`
        svg {
          opacity: 1;

          animation: scaleIcon 1250ms ease-in-out;
        }
      `,
  ]
);

const AdminGear = ({
  links = [],
  indexationRules,
  itemName,
  itemId,
  hideCommonLinks,
  infoText = [],
  functionalItems = [],
  translationLink,
  customerInfo,
  refetchCartData,
  templateInput,
}: {
  links?: AdminGearTypes.AdminLink[];
  indexationRules: {
    allowChanging: boolean;
  };
  itemId?: number;
  itemName?: string;
  hideCommonLinks: boolean;
  infoText?: string[];
  functionalItems?: AdminGearTypes.AdminFunctionalItem[];
  translationLink?: string;
  customerInfo?: CartTypes.CommonCustomerInfoInput;
  refetchCartData?: () => void;
  templateInput?: TemplateInput;
}) => {
  const activeLocale = useActiveLocale();
  const { asPath, route } = useRouter();
  const [isOpen, toggleOpen] = useToggle();
  const [isIndexingModalOpen, toggleIndexingModal] = useToggle();
  const [isSaveCartModalOpen, toggleSaveCartModal] = useToggle();
  const [isConnectPkgModalOpen, toggleConnectPkgModal] = useToggle();
  const [isReservationModalOpen, toggleReservationModal] = useToggle();

  const { adminUrl, marketplaceUrl, marketplace } = useSettings();
  const isGTI = marketplace === Marketplace.GUIDE_TO_ICELAND;
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { allowChanging } = indexationRules || {};
  const { user } = useSession();
  const isIndexed =
    document.querySelector("meta[name='robots']")?.getAttribute("content") !== "noindex";
  const path = normalizePathForSurrogateKeys(asPath, isGTI);
  const documentAge = (document?.getElementById("documentAge") as HTMLInputElement)?.value;

  const { handleCacheClear, cacheClearingLoadingState } = useHandleCacheClear();

  const { handleSaveCart, isCartLinkCopied, isCartSaveLoading, isSavingCartError, cartLink } =
    useSaveCart({
      toggleSaveCartModal,
    });

  const onRefetchCartData = () => {
    refetchCartData?.();
  };

  const {
    handleFetchUrl,
    error: templateError,
    loading: templateLoading,
  } = useGetTemplate({
    request: templateInput,
  });

  const {
    createReservationPaymentLink,
    createPaymentLinkError,
    missingCustomerInfoFields,
    onDismissApolloError,
    isCreatePaymentLinkLoading,
    isCreatePaymentLinkSuccessful,
  } = useCreateReservation({ customerInfo, refetchCartData });

  const handleCacheClearForSinglePage = useCallback(() => {
    handleCacheClear({ surrogateKey: asPathWithoutQueryParams(asPath) });
  }, [asPath, handleCacheClear]);

  const isCacheClearing =
    cacheClearingLoadingState.singlePage || cacheClearingLoadingState.multiPage;

  const isCartPage = route === `/${ROUTE_NAMES.CART}` || route === `/${ROUTE_NAMES.MOBILE_PAYMENT}`;

  return (
    <>
      <Wrapper isOpen={isOpen}>
        <MenuHeader>
          <Button onClick={toggleOpen}>
            <CogIcon isIndexed={isIndexed} />
          </Button>
        </MenuHeader>
        <Menu hasInfoText={infoText.length > 0}>
          <List>
            {infoText && (
              <>
                {infoText.map(text => (
                  <InfoText>
                    <span>{text}</span>
                  </InfoText>
                ))}
              </>
            )}
            {isCartPage && (
              <>
                {!isGTE && (
                  <>
                    <ListItem>
                      <MenuItemButton onClick={toggleConnectPkgModal}>
                        Connect to a package
                      </MenuItemButton>
                    </ListItem>
                    <MarketplaceModals
                      isConnectPkgModalOpen={isConnectPkgModalOpen && isCartPage}
                      toggleConnectPkgModal={toggleConnectPkgModal}
                      onRefetchCartData={onRefetchCartData}
                    />
                  </>
                )}
                <ListItem>
                  <SaveCartButton
                    onClick={handleSaveCart}
                    disabled={isCartSaveLoading}
                    isCartLinkCopied={!isSavingCartError && isCartLinkCopied}
                  >
                    Save cart
                    <LinkIcon />
                  </SaveCartButton>
                </ListItem>
                <ListItem>
                  <MenuItemButton onClick={toggleReservationModal}>
                    Create a reservation payment link
                  </MenuItemButton>
                </ListItem>
              </>
            )}
            {[
              ...getCommonAdminLinks(
                path,
                adminUrl,
                marketplaceUrl,
                {
                  isAdmin: user?.isAdmin ?? false,
                  isTranslator: user?.isTranslator ?? false,
                },
                activeLocale,
                hideCommonLinks
              ),
              ...filterAvailableLinks(links, user?.isAdmin ?? false),
            ].map(link => (
              <ListItem key={link.url}>
                <a
                  href={link.url}
                  target={link?.options?.linkTarget || "_blank"}
                  rel="noopener noreferrer"
                >
                  {link.name}
                </a>
              </ListItem>
            ))}
            {translationLink && (
              <ListItem key="FAQtranslationLink">
                <a href={translationLink} target="_blank" rel="noopener noreferrer">
                  Translate FAQs
                </a>
              </ListItem>
            )}
            {((templateInput && !templateError && isGTE) || templateLoading) && (
              <ListItem key="getOrCreateTemplateUrl">
                {templateLoading ? (
                  <div>Fetching or creating template url...</div>
                ) : (
                  <button onClick={handleFetchUrl} type="button">
                    Customise NLG template
                  </button>
                )}
              </ListItem>
            )}
            {user?.isAdmin && (
              <>
                {documentAge && (
                  <DocumentAge>
                    <span>
                      {`Document age: ${getFormattedDate(
                        new Date(Number(documentAge)),
                        dayMonthYearWithTimeFormat
                      )}`}
                    </span>
                  </DocumentAge>
                )}
                {(isServerless || isProd()) && (
                  <>
                    {[
                      ...(functionalItems || emptyArray).map(({ name, onClick, loading }) => (
                        <ListItem>
                          <CacheClearingButton
                            onClick={onClick}
                            disabled={loading}
                            isLoading={loading}
                          >
                            {name}
                          </CacheClearingButton>
                        </ListItem>
                      )),
                    ]}
                    <ListItem>
                      <CacheClearingButton
                        onClick={handleCacheClearForSinglePage}
                        disabled={isCacheClearing}
                        isLoading={cacheClearingLoadingState.singlePage}
                      >
                        Rebuild cache
                      </CacheClearingButton>
                    </ListItem>
                    {!isGTE ? (
                      <ListItem>
                        <CacheClearingButton
                          onClick={() => {
                            if (
                              // eslint-disable-next-line no-restricted-globals,no-alert
                              confirm(
                                "Are you sure?\n\nPlease, try to avoid clearing cache by page type. If possible, clear only required pages. "
                              )
                            ) {
                              handleCacheClear({
                                surrogateKey: extractPageTypeFromRoute(route),
                                isSinglePage: false,
                              });
                            }
                          }}
                          disabled={isCacheClearing}
                          isLoading={cacheClearingLoadingState.multiPage}
                          isSmall
                        >
                          Rebuild cache for all pages of type:
                          <b>{` ${extractPageTypeFromRoute(route)}`}</b>
                        </CacheClearingButton>
                      </ListItem>
                    ) : (
                      <ListItem>
                        <InfoText>{`Page type: ${extractPageTypeFromRoute(route)}`}</InfoText>
                      </ListItem>
                    )}
                  </>
                )}
                <IndexedLi isIndexed={isIndexed}>
                  <MenuItemButton onClick={toggleIndexingModal} disabled={!allowChanging}>
                    {isIndexed ? "Indexed" : "Not indexed"}
                  </MenuItemButton>
                </IndexedLi>
              </>
            )}
          </List>
        </Menu>
        {isIndexingModalOpen && itemName && (
          <IndexingModalContainer
            isIndexed={isIndexed}
            toggle={toggleIndexingModal}
            objectType={itemName}
            objectId={itemId}
            handleCacheClearForSinglePage={handleCacheClearForSinglePage}
          />
        )}
      </Wrapper>
      {isCartPage && isSaveCartModalOpen && (
        <SaveCartModal
          isCartLinkCopied={isCartLinkCopied}
          onToggleModal={toggleSaveCartModal}
          isSavingCartError={isSavingCartError}
          cartLink={cartLink}
        />
      )}
      {isCartPage && isReservationModalOpen && (
        <CreateReservationModal
          isCreatePaymentLinkLoading={isCreatePaymentLinkLoading}
          onToggleModal={toggleReservationModal}
          onCreateReservationPaymentLink={createReservationPaymentLink}
          createPaymentLinkError={createPaymentLinkError}
          missingCustomerInfoFields={missingCustomerInfoFields}
          onDismissApolloError={onDismissApolloError}
          onRefetchCartData={onRefetchCartData}
          isCreatePaymentLinkSuccessful={isCreatePaymentLinkSuccessful}
        />
      )}
    </>
  );
};

export default AdminGear;

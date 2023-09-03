import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
// eslint-disable-next-line no-restricted-imports
import LazyHydrate from "react-lazy-hydration";

import FooterImage from "./FooterImage";
import FooterContainer from "./FooterContainer?ssrOnly";

import CustomNextDynamic from "lib/CustomNextDynamic";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import { Marketplace } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import { mqMin, hideDuringPrint } from "styles/base";
import TopServicesContainer from "components/ui/TopServices/TopServicesContainer";
import Container from "components/ui/Grid/Container";

export const SubscribeFormLoading = styled.div`
  height: 188px;

  ${mqMin.medium} {
    height: 250px;
  }
`;

const Wrapper = styled.div([
  hideDuringPrint,
  css`
    padding-top: 1px; /* Need this to avoid problems with booking widget */
    word-break: break-word;
  `,
]);

const LazySubscribeForm = CustomNextDynamic(
  () => import("components/ui/SubscriptionsForm/SubscribeForm"),
  {
    ssr: false,
    loading: () => <SubscribeFormLoading />,
  }
);

const FooterWrapper = ({
  theme,
  showTopServices,
  showSubscriptionForm,
}: {
  theme: Theme;
  showTopServices: boolean;
  showSubscriptionForm: boolean;
}) => {
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;

  return (
    <Wrapper id="main-footer">
      <Container>
        {showTopServices && !isGTE && <TopServicesContainer />}
        {showSubscriptionForm && (
          <LazyComponent
            lazyloadOffset={LazyloadOffset.Medium}
            loadingElement={<SubscribeFormLoading />}
          >
            <LazySubscribeForm isGTE={isGTE} />
          </LazyComponent>
        )}
      </Container>
      {isGTE && <FooterImage />}
      <LazyHydrate ssrOnly>
        <FooterContainer theme={theme} />
      </LazyHydrate>
    </Wrapper>
  );
};

export default FooterWrapper;

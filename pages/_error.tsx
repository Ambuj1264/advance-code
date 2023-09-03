import React, { ReactNode } from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import Button from "@travelshift/ui/components/Inputs/Button";
import { ButtonSize } from "@travelshift/ui/types/enums";
import Imgix from "react-imgix";
import { useTheme } from "emotion-theming";

import AdminGearLoader from "../components/features/AdminGear/AdminGearLoader";

import Header from "components/features/Header/MainHeader";
import { gutters, redColor, greyColor } from "styles/variables";
import UsersnapLoader from "components/ui/Usersnap/UsersnapLoader";
import { mqMin } from "styles/base";
import { typographyH4, typographyH3, typographySubtitle2 } from "styles/typography";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import NoIndex from "components/features/SEO/NoIndex";
import useGraphCMSNamespaces from "lib/useGraphCMSNamespaces";
import lazyCaptureException from "lib/lazyCaptureException";
import PWAMetaTags from "lib/PWAMetaTags";
import { useSettings } from "contexts/SettingsContext";

export const mockTheme: Theme = {
  colors: {
    primary: "#336699",
    action: "#33ab63",
  },
};

const ErrorImage = styled(Imgix, { shouldForwardProp: () => true })<{
  src: string;
  htmlAttributes?: any;
  width?: number;
  height?: number;
}>`
  margin-top: ${gutters.large}px;
  width: 320px;
  height: 320px;
`;

const ErrorHeading = styled.span([
  typographyH4,
  css`
    color: ${redColor};
    ${mqMin.large} {
      ${typographyH3};
    }
  `,
]);

const ErrorSubHeading = styled.span([
  typographySubtitle2,
  css`
    margin-top: ${gutters.small}px;
    color: ${rgba(greyColor, 0.7)};
    ${mqMin.large} {
      ${typographyH4};
    }
  `,
]);

const ButtonContainer = styled.div`
  width: 175px;
  & + & {
    margin-left: ${gutters.large}px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: ${gutters.large * 2}px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: calc(100vh - 50px);
`;

const Translate = ({ children }: { children: ReactNode }) => (
  <Trans ns={Namespaces.errorNs}>{children}</Trans>
);

const ErrorPage = ({
  statusCode,
  fromErrorComponent = false,
}: {
  statusCode?: number;
  fromErrorComponent?: boolean;
}) => {
  useGraphCMSNamespaces([Namespaces.errorNs, Namespaces.headerNs, Namespaces.footerNs]);
  const { t } = useTranslation(Namespaces.errorNs);
  const errorStatus = statusCode && statusCode >= 500 ? t("Unexpected error") : t("Page not found");
  const errorHeading = `${statusCode || 404} - ${errorStatus}`;
  const theme: Theme = useTheme();
  const { marketplace } = useSettings();

  return (
    <>
      <NoIndex />
      {statusCode && !fromErrorComponent && <Header />}
      <PWAMetaTags marketplace={marketplace} theme={theme} />
      <Head>
        <title>{errorHeading}</title>
      </Head>
      <Container>
        <ErrorHeading>{errorHeading}</ErrorHeading>
        <ErrorSubHeading>
          <Translate>We apologise for the inconvenience</Translate>
        </ErrorSubHeading>
        <ErrorImage
          src="https://guidetoiceland.imgix.net/562531/x/0/errorimage.jpg?w=320&h=320"
          htmlAttributes={{
            alt: "",
          }}
          width={320}
          height={320}
        />
        <ButtonWrapper>
          <ButtonContainer>
            <Button
              id="backButton"
              onClick={() => window.history.back()}
              buttonSize={ButtonSize.Small}
              theme={mockTheme}
              inverted
            >
              <Translate>Back</Translate>
            </Button>
          </ButtonContainer>
          <ButtonContainer>
            <Button id="homeButton" href="/" buttonSize={ButtonSize.Small} theme={mockTheme}>
              <Translate>Home</Translate>
            </Button>
          </ButtonContainer>
        </ButtonWrapper>
      </Container>
      <UsersnapLoader />
      <AdminGearLoader />
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const maybeRes = res || err;
  const statusCode = maybeRes && maybeRes.statusCode !== 200 ? maybeRes.statusCode : 404;
  if (err) {
    lazyCaptureException(err);
  }

  return {
    statusCode,
    namespacesRequired: [Namespaces.errorNs, Namespaces.headerNs, Namespaces.footerNs],
    queries: [],
    redirectCheck: true,
    isTopServicesHidden: true,
    isSubscriptionFormHidden: true,
  };
};

export default ErrorPage;

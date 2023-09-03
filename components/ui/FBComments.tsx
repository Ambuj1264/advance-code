import React, { useContext, useEffect, useRef, useState } from "react";
import { FacebookProvider, Initialize, Comments, Like } from "react-facebook";
import styled from "@emotion/styled";
import { getLocaleRfcTag } from "@travelshift/ui/utils/localeUtils";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { blackColor, fontWeightSemibold, gutters } from "styles/variables";
import { useSettings } from "contexts/SettingsContext";
import LocaleContext from "contexts/LocaleContext";
import { typographyBody1, typographySubtitle1 } from "styles/typography";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const Wrapper = styled.div`
  margin-top: ${gutters.large}px;
  width: 100%;
  overflow: hidden;
`;

const LoginMessage = styled.div(({ theme }) => [
  typographyBody1,
  css`
    ${typographySubtitle1};
    color: ${rgba(blackColor, 0.7)};

    a {
      color: ${theme.colors.primary};
      font-weight: ${fontWeightSemibold};
      &:hover {
        text-decoration: underline;
      }
    }
  `,
]);

const FBComments = ({
  likeUrl = "",
  commentsUrl = "",
}: {
  likeUrl?: string;
  commentsUrl?: string;
}) => {
  const { facebookAppId } = useSettings();
  const activeLocale = useContext(LocaleContext);
  const language = getLocaleRfcTag(activeLocale);
  const fbWrapperRef = useRef<HTMLDivElement>(null);
  const [fbReadyState, setFbReadyState] = useState(false);
  const [fbLoginRequired, setFbLoginRequired] = useState(false);

  useEffect(() => {
    if (!fbWrapperRef.current) return;

    if (fbReadyState) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const iframes = fbWrapperRef.current!.querySelectorAll("iframe");
        const fbIframeFailedToLoad = Array.from(iframes).some(iframe => iframe.offsetHeight < 10);
        if (fbIframeFailedToLoad) {
          setFbLoginRequired(fbIframeFailedToLoad);
        }
      }, 1000);
    }
  }, [fbReadyState]);

  return (
    <Wrapper ref={fbWrapperRef}>
      <FacebookProvider appId={facebookAppId} language={language}>
        <Initialize>
          {/* eslint-disable-next-line react/no-unused-prop-types */}
          {({ isReady }: { isReady: boolean }) => {
            if (isReady && !fbReadyState) setFbReadyState(true);
            return null;
          }}
        </Initialize>
        {!fbLoginRequired && (
          <>
            <Like
              share
              href={likeUrl}
              showFaces={false}
              layout="button_count"
              kidDirectedSite={false}
            />
            <Comments mobile href={commentsUrl} />
          </>
        )}
        {fbLoginRequired && (
          <LoginMessage>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <Trans ns={Namespaces.articleNs}>
                Log into Facebook to read insider tips from travelers or add a comment of your own.
              </Trans>
            </a>
          </LoginMessage>
        )}
      </FacebookProvider>
    </Wrapper>
  );
};

export default FBComments;

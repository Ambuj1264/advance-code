/* eslint-disable no-param-reassign, @typescript-eslint/no-unused-expressions */

import React, {
  useCallback,
  useEffect,
  useState,
  MutableRefObject,
  memo,
  useRef,
  SyntheticEvent,
} from "react";
import { useIntercom, IntercomProvider } from "react-use-intercom";
import { useTheme } from "emotion-theming";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

import ContactUsButton, { Button } from "./ContactUsButton";

import { useIsDesktop } from "hooks/useMediaQueryCustom";
import { useGlobalContext } from "contexts/GlobalContext";
import { intercomConfig } from "utils/constants";
import { Direction } from "types/enums";
import { useTranslation } from "i18n";
import IntercomIcon from "components/icons/intercom.svg";
import useSession from "hooks/useSession";
import { useSettings } from "contexts/SettingsContext";
import { mqMin } from "styles/base";

const StyledContactUsButton = styled(ContactUsButton)`
  svg {
    top: 10px;
    right: 8px;
    width: 29px;
    height: 27px;
  }

  ${mqMin.desktop} {
    ${Button} {
      width: 56px;
      max-width: 56px;
      height: 56px;
    }

    svg {
      top: 11px;
      right: 10px;
      width: 32px;
      height: 32px;
    }
  }
`;

type Props = {
  position?: Direction;
  mobileMargin?: number;
  zIndexValue?: number;
  onIntercomHoverClick?: () => void;
};

const getAlignment = (position?: Direction) => {
  return position === Direction.Left ? "left" : "right";
};

const ContactUsIntercomButton = ({
  position,
  mobileMargin,
  onIntercomHoverClick,
  zIndexValue,
  intercomLastPing,
}: Props & { intercomLastPing: MutableRefObject<string | undefined> }) => {
  const router = useRouter();
  const { user } = useSession();
  const hasPreviouslyBooted = useRef(false);
  const theme: Theme = useTheme();
  const { boot, show, update } = useIntercom();
  const { t } = useTranslation();
  const alignment = getAlignment(position);
  const bootIntercom = useCallback(() => {
    if (!hasPreviouslyBooted.current) {
      // eslint-disable-next-line functional/immutable-data
      hasPreviouslyBooted.current = true;
      boot({
        customLauncherSelector: "#contactUsButtonWrapper",
        hideDefaultLauncher: true,
        backgroundColor: theme.colors.primary,
        actionColor: theme.colors.action,
        email: user?.email,
        name: user?.name,
        alignment,
      });
    }
  }, [alignment, boot, theme.colors.action, theme.colors.primary, user]);

  const ping = useCallback(() => {
    if (window.location.href !== intercomLastPing.current) {
      !hasPreviouslyBooted.current && bootIntercom();
      window.Intercom?.("update", {
        last_requested_at: new Date().getTime(),
        alignment: getAlignment(position),
      });
      intercomLastPing.current = window.location.href;
    }
  }, [bootIntercom, intercomLastPing, position]);

  useEffect(() => {
    window.Intercom?.("update", {
      alignment: getAlignment(position),
    });
  }, [position]);

  useEffect(() => {
    // pings intercom in case component gets recreated upon navigation
    if (intercomLastPing.current) {
      ping();
    }

    // Pings intercom for client side navigation
    if (!intercomLastPing.current) {
      router.events.on("routeChangeComplete", ping);
    }

    intercomLastPing.current = window.location.href;

    if ((user?.email || user?.name) && hasPreviouslyBooted.current) {
      window.Intercom?.("update", {
        email: user?.email,
        name: user?.name,
      });
    }
  }, [bootIntercom, intercomLastPing, ping, router.events, update, user]);

  return (
    <StyledContactUsButton
      label={t("Contact Us")}
      onClick={(e: SyntheticEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        bootIntercom();
        show();
      }}
      position={position}
      mobileMargin={mobileMargin}
      Icon={IntercomIcon}
      zIndexValue={zIndexValue}
      onHoverClick={onIntercomHoverClick}
    />
  );
};

const ContactUsIntercomProvider = (props: Props) => {
  const { marketplace } = useSettings();
  const isDesktop = useIsDesktop();
  const { intercomLastPing } = useGlobalContext();
  const wasInitialized = !!intercomLastPing.current;
  const [shouldInitialize, setShouldInitialize] = useState(wasInitialized);

  useEffect(() => {
    const initializeTimer = setTimeout(
      () => {
        if (!shouldInitialize) setShouldInitialize(true);
      },
      isDesktop ? 10000 : 15000
    );

    return () => clearTimeout(initializeTimer);
  }, [isDesktop, shouldInitialize]);

  const onIntercomHoverClick = useCallback(() => setShouldInitialize(true), []);
  const onHideIntercom = useCallback(() => {
    // dirty hack to avoid conflict between next and intercom after using widget
    // https://github.com/vercel/next.js/issues/9573
    const removeMutationListener = () => {
      document.head.removeEventListener("DOMNodeInserted", removeMutationListener);
      const metaViewport = document.querySelector("meta[name='viewport']");
      const metaTitle = document.head.querySelector("title");

      if (metaViewport && metaTitle) {
        document.head.insertBefore(metaViewport, metaTitle);
      }
    };

    if (!isDesktop) {
      document.head.addEventListener("DOMNodeInserted", removeMutationListener, false);
    }
  }, [isDesktop]);
  const intercomAppId = intercomConfig[marketplace];

  return (
    <IntercomProvider
      autoBoot={false}
      appId={intercomAppId!}
      shouldInitialize={wasInitialized || (shouldInitialize && !!intercomAppId)}
      onHide={onHideIntercom}
    >
      <ContactUsIntercomButton
        {...props}
        onIntercomHoverClick={onIntercomHoverClick}
        intercomLastPing={intercomLastPing}
      />
    </IntercomProvider>
  );
};

export default memo(ContactUsIntercomProvider);

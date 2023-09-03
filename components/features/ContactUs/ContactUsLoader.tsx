import React, { useContext } from "react";

import useEffectOnce from "hooks/useEffectOnce";
import useToggle from "hooks/useToggle";
import CustomNextDynamic from "lib/CustomNextDynamic";
import MobileFooterContext from "contexts/MobileFooterContext";

const ContactUsContainer = CustomNextDynamic(
  () => import("components/features/ContactUs/ContactUsContainer"),
  {
    loading: () => null,
  }
);

const ContactUsIntercomButton = CustomNextDynamic(
  () => import("components/features/ContactUs/ContactUsIntercomButton"),
  {
    loading: () => null,
  }
);

const ContactUsLoader = ({ pageProps, useIntercom }: { pageProps: any; useIntercom: boolean }) => {
  const [isClient, toggleIsClient] = useToggle(false);
  const { contactUsBottomPosition, contactUsButtonPosition, isMobileFooterShown } =
    useContext(MobileFooterContext);
  const contactUsMobileBottomPosition = contactUsBottomPosition || pageProps.contactUsMobileMargin;

  useEffectOnce(toggleIsClient);

  if (!isClient) return null;

  return !useIntercom ? (
    <ContactUsContainer
      mobileMargin={isMobileFooterShown ? contactUsMobileBottomPosition : undefined}
      zIndexValue={pageProps?.contactUsButtonZIndex}
      productName={window.location.pathname}
      buttonPosition={pageProps.contactUsButtonPosition ?? contactUsButtonPosition}
    />
  ) : (
    <ContactUsIntercomButton
      mobileMargin={isMobileFooterShown ? contactUsMobileBottomPosition : undefined}
      zIndexValue={pageProps?.contactUsButtonZIndex}
      position={pageProps.contactUsButtonPosition ?? contactUsButtonPosition}
    />
  );
};

export default ContactUsLoader;

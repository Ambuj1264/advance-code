import React from "react";
import GTILogo from "@travelshift/ui/icons/gti-logo-desktop.svg";
import GTTPLogo from "@travelshift/ui/icons/gttp-logo.svg";
import IPTLogo from "@travelshift/ui/icons/ipt-logo.svg";
import NTGLogo from "@travelshift/ui/icons/ntg-logo.svg";
import TravelshiftLogo from "@travelshift/ui/icons/travelshift-logo.svg";
import styles from "@travelshift/ui/components/Header/Logo.scss";

import GTEImageLogo from "./GTEImageLogo";

const Logo = ({ marketplace, className }: { marketplace: string; className?: string }) => {
  const classNames = `${styles.logo} ${className}`;
  switch (marketplace) {
    case "guidetoiceland_is":
      return <GTILogo id="logo" className={classNames} styleName="logo" />;
    case "gttp-travelmarketplaces-com":
      return (
        <GTTPLogo className={`${classNames} ${styles.gttp}`} styleName="logo gttp" id="logo" />
      );
    case "gte-travelmarketplaces-com":
      return <GTEImageLogo classNames={classNames} id="logo" />;
    case "ipt-travelmarketplaces-com":
      return <IPTLogo className={classNames} styleName="logo" id="logo" />;
    case "norwaytravelguide_no":
      return <NTGLogo className={classNames} styleName="logo" id="logo" />;
    case "travelshift-generic":
      return <TravelshiftLogo className={classNames} styleName="logo" id="logo" />;
    default:
      return <GTILogo className={classNames} styleName="logo" id="logo" />;
  }
};

export default Logo;

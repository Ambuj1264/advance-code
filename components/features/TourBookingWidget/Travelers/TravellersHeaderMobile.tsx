import React from "react";

import SectionHeader from "../BookingWidgetSectionHeader";

import MediaQuery from "components/ui/MediaQuery";
import { DisplayType } from "types/enums";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

// TODO: maybe we can reuse it for GTE as well
const TravellersHeaderMobile = () => (
  <MediaQuery toDisplay={DisplayType.Large}>
    <SectionHeader>
      <Trans ns={Namespaces.tourBookingWidgetNs}>Travellers</Trans>
    </SectionHeader>
  </MediaQuery>
);

export default TravellersHeaderMobile;

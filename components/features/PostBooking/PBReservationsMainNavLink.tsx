import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Arrow from "@travelshift/ui/icons/arrow.svg";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ClientLink from "components/ui/ClientLink";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import { Namespaces } from "shared/namespaces";
import { PageType } from "types/enums";
import { getClientSideUrl } from "utils/helperUtils";
import { typographyCaption } from "styles/typography";
import { gutters } from "styles/variables";

const StyledClientLink = styled(ClientLink)(
  ({ theme }) => css`
    margin-top: ${gutters.small / 2}px;
    color: ${theme.colors.primary};
    ${typographyCaption};
  `
);

const StyledArrowLeft = styled(Arrow)(
  ({ theme }) => css`
    margin-right: ${gutters.small / 2}px;
    width: 6px;
    transform: rotate(180deg);
    fill: ${theme.colors.primary};
  `
);

const PBReservationsMainNavLink = ({ className }: { className?: string }) => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();

  const clientRoute = useMemo(
    () => ({
      route: `/${PageType.GTE_POST_BOOKING}`,
      as: `${getClientSideUrl(
        PageType.GTE_POST_BOOKING,
        activeLocale,
        marketplace
      )}?nav=reservations`,
    }),
    [activeLocale, marketplace]
  );

  return (
    <StyledClientLink clientRoute={clientRoute} className={className}>
      <StyledArrowLeft />
      {postbookingT("Back to reservations page")}
    </StyledClientLink>
  );
};

export default PBReservationsMainNavLink;

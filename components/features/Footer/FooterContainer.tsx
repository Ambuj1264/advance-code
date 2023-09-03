import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import { useQuery } from "@apollo/react-hooks";
import Footer from "@travelshift/ui/components/Footer/Footer";
import styles from "@travelshift/ui/components/Footer/styles";
import { Column } from "@travelshift/ui/components/Footer/FooterColumns";

import { getSocialMediaItems } from "./footerUtils";
import newFooterQuery from "./queries/NewFooterQuery.graphql";

import { useTranslation } from "i18n";
import Container, { DesktopContainer, MobileContainer } from "components/ui/Grid/Container";
import { Namespaces } from "shared/namespaces";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import { longCacheHeaders } from "utils/apiUtils";

const FooterContainer = ({ theme }: { theme: Theme }) => {
  const { t } = useTranslation(Namespaces.footerNs);
  const { marketplaceUrl } = useSettings();
  const activeLocale = useActiveLocale();
  const { data, error } = useQuery<{
    footers: { columns: Column[] }[];
  }>(newFooterQuery, {
    variables: {
      marketplaceUrl: marketplaceUrl.replace("staging.", ""),
      locale: activeLocale,
    },
    context: {
      headers: longCacheHeaders,
    },
  });
  if (error || !data || error || data.footers.length === 0) return null;
  const { columns } = data.footers?.[0] ?? [];
  const socialMediaItems = getSocialMediaItems(columns);

  return (
    <Footer
      columns={columns.slice(0, 4)}
      socialMediaLinks={socialMediaItems}
      theme={theme}
      Container={Container}
      DesktopContainer={DesktopContainer}
      MobileContainer={MobileContainer}
      socialMediaSectionText={t("front_footer_social_media")}
    />
  );
};

export default withStyles(...styles)(FooterContainer);

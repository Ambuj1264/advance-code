import React from "react";

import CustomNextDynamic from "lib/CustomNextDynamic";
import useSession from "hooks/useSession";

const AffiliateButton = CustomNextDynamic(() => import("./AffiliateButton"), {
  ssr: false,
});

type Props = {
  url: string;
};

const AffiliateButtonContainer = ({ url }: Props) => {
  const { user } = useSession();
  if (user?.isAdmin || user?.isAffiliate) {
    return <AffiliateButton url={url} userId={user.id} />;
  }
  return null;
};

export default AffiliateButtonContainer;

/* eslint-disable react/destructuring-assignment */
import React from "react";

import ClientLink from "./ClientLink";

const MaybeClientLink = (
  props: Omit<Parameters<typeof ClientLink>[0], "clientRoute"> & {
    clientRoute?: SharedTypes.ClientRoute;
    skipTag?: boolean;
    key?: string | number;
  }
) => {
  if (props.clientRoute) {
    return <ClientLink {...props} clientRoute={props.clientRoute} />;
  }

  if (props.skipTag) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{props.children}</>;
  }

  return <span className={props.className}>{props.children}</span>;
};
export default MaybeClientLink;

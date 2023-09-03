// eslint-disable-next-line import/no-import-module-exports
import React from "react";

module.exports = {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  Trans: ({ children }) => <>{children}</>,
  useTranslation: () => ({
    t: key => key,
  }),
};

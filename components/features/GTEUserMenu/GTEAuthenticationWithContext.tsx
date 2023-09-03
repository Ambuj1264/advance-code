import React from "react";

import { getAuthInstance } from "../Auth0Authentication/utils/auth0Utils";

import { AuthStateContextProvider } from "./contexts/GTEAuthContext";
import GTEAuthenticationForm from "./GTEAuthenticationForm";

const GTEAuthenticationWithContext = ({
  host,
  setModalText,
}: {
  host: string;
  setModalText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <AuthStateContextProvider
      auth0Instance={getAuthInstance(host)}
      isReset={false}
      isSubmitting={false}
      host={host}
    >
      <GTEAuthenticationForm setModalText={setModalText} />
    </AuthStateContextProvider>
  );
};

export default GTEAuthenticationWithContext;

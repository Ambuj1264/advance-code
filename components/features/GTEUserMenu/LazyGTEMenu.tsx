import styled from "@emotion/styled";
import React from "react";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { useSettings } from "contexts/SettingsContext";
import AuthFormLoading from "components/ui/Loading/AuthFormLoading";

const LazyGTEMobileMenu = CustomNextDynamic(
  () => import("components/features/GTEUserMenu/GTEAuthenticationWithContext"),
  {
    ssr: false,
    loading: () => <AuthFormLoading />,
  }
);

const LazyWrapper = styled.div``;

const LazyGTEMenu = ({
  setModalText,
}: {
  setModalText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { host } = useSettings();
  return (
    <LazyWrapper>
      <LazyGTEMobileMenu host={host} setModalText={setModalText} />
    </LazyWrapper>
  );
};

export default LazyGTEMenu;

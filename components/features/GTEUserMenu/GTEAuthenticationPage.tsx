import styled from "@emotion/styled";
import React from "react";

import GTEAuthenticationWithContext from "./GTEAuthenticationWithContext";
import AuthenticationFormHeader from "./AuthenticationFormHeader";

import { useSettings } from "contexts/SettingsContext";
import { borderRadius, boxShadowTopLight, gutters } from "styles/variables";

const AuthenticationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${gutters.large}px;
  width: 100vw;
`;

const AuthenticationWrapper = styled.div`
  width: 100%;
  min-width: 340px;
  height: fit-content;
`;

const ContentWrapper = styled.div`
  box-shadow: ${boxShadowTopLight};
  border-radius: ${borderRadius};
  padding: ${gutters.small}px;
`;

const GTEAuthenticationPage = ({ headingText }: { headingText?: string }) => {
  const { host } = useSettings();
  return (
    <AuthenticationContainer>
      <ContentWrapper>
        <AuthenticationFormHeader title={headingText ?? "Log in"} />
        <AuthenticationWrapper>
          <GTEAuthenticationWithContext host={host} setModalText={() => {}} />
        </AuthenticationWrapper>
      </ContentWrapper>
    </AuthenticationContainer>
  );
};

export default GTEAuthenticationPage;

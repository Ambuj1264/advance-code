import React from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import Section from "components/ui/Section/Section";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import Button from "components/ui/Inputs/Button";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  min-width: 180px;
`;

const CarRentalInformation = ({
  productInformation,
  establishmentName,
}: {
  productInformation: CarTypes.Document;
  establishmentName: string;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.commonCarNs);
  return (
    <Section key="carRentalInformation">
      <ButtonWrapper>
        <ButtonContainer>
          <Button
            light
            theme={theme}
            id="carRentalInformation"
            href={productInformation.url}
            target="_blank"
          >
            {t("{establishmentName} rental terms", {
              establishmentName,
            })}
          </Button>
        </ButtonContainer>
      </ButtonWrapper>
    </Section>
  );
};

export default CarRentalInformation;

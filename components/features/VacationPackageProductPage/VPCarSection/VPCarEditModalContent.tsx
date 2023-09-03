import React from "react";
import styled from "@emotion/styled";
import { ApolloError } from "apollo-client";

import { ModalBanner } from "../vpShared";

import VPCarEditModalContentLoading from "./VPCarEditModalContentLoading";

import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import InsurancesContainer from "components/features/Car/CarBookingWidget/Options/Insurances/InsurancesContainer";
import ExtrasContainer from "components/features/Car/CarBookingWidget/Options/Extras/ExtrasContainer";
import { mqMax } from "styles/base";

export const Wrapper = styled.div`
  ${mqMax.large} {
    padding-bottom: 0;
  }
`;

const VPCarEditModalContent = ({
  isLoading = false,
  isError,
  selectedCarOffer,
  insurances,
  extras,
  selectedInsurances,
  selectedExtras,
  onSetSelectedExtra,
  onSetSelectedExtraQuestionAnswers,
  onSetSelectedInsurance,
}: {
  isLoading?: boolean;
  isError?: ApolloError;
  selectedCarOffer?: CarTypes.CarOffer | undefined;
  insurances: OptionsTypes.Option[];
  extras: OptionsTypes.Option[];
  selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[];
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
  onSetSelectedExtra: (selectedExtra: CarBookingWidgetTypes.SelectedExtra) => void;
  onSetSelectedExtraQuestionAnswers: (
    selectedExtraId: string,
    answer: CarBookingWidgetTypes.SelectedExtraQuestionAnswer
  ) => void;
  onSetSelectedInsurance: (
    selectedInsurance: CarBookingWidgetTypes.OnSelectedInsuranceInput
  ) => void;
}) => {
  if (isError) {
    return null;
  }

  if (isLoading || !selectedCarOffer) return <VPCarEditModalContentLoading />;

  return (
    <Wrapper>
      {insurances.length ? (
        <ModalBanner>
          <Trans ns={Namespaces.vacationPackageNs}>Choose insurances</Trans>
        </ModalBanner>
      ) : null}
      <InsurancesContainer
        selectedInsurances={selectedInsurances}
        onSetSelectedInsurance={onSetSelectedInsurance}
        options={insurances}
        shouldFormatPrice
      />
      {extras.length ? (
        <ModalBanner>
          <Trans ns={Namespaces.vacationPackageNs}>Available extras</Trans>
        </ModalBanner>
      ) : null}
      <ExtrasContainer
        selectedExtras={selectedExtras}
        onSetSelectedExtra={onSetSelectedExtra}
        options={extras}
        onSetSelectedExtraQuestionAnswers={onSetSelectedExtraQuestionAnswers}
        shouldFormatPrice
      />
    </Wrapper>
  );
};

export default VPCarEditModalContent;

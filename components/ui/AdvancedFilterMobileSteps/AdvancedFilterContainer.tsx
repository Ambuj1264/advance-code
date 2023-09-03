import React, { Context, useCallback, useContext } from "react";
import styled from "@emotion/styled";

import { StepsEnum } from "./advancedFilterHelpers";

import FilterGeneralDetailsForm from "components/features/SearchPage/FilterGeneralDetailsForm";
import { mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const FormWrapper = styled.div`
  display: block;
  width: 100%;
  ${mqMin.large} {
    display: none;
  }
`;

const AdvancedFilterContainer = ({
  context,
  locationPlaceholder,
}: {
  context: Context<any>;
  locationPlaceholder?: string;
}) => {
  const { t } = useTranslation(Namespaces.tourSearchNs);
  const locationLabel = t("Starting location");
  const { isAdvancedSearchModalOpen, selectedLocationName, setContextState } = useContext(context);

  const getParticularStepOpenHandler = useCallback(
    (step: StepsEnum, isOpen?: boolean) => () => {
      setContextState({
        advancedSearchCurrentStep: step,
        isAdvancedSearchModalOpen: isOpen === undefined ? !isAdvancedSearchModalOpen : isOpen,
      });
    },
    [isAdvancedSearchModalOpen, setContextState]
  );

  return (
    <FormWrapper>
      <FilterGeneralDetailsForm
        isMobile
        locationLabel={locationLabel}
        onLocationInputClick={getParticularStepOpenHandler(StepsEnum.Details)}
        onDateInputClick={getParticularStepOpenHandler(StepsEnum.Dates)}
        onTravellersInputClick={getParticularStepOpenHandler(StepsEnum.Details)}
        locationPlaceholder={locationPlaceholder || selectedLocationName}
        context={context}
      />
    </FormWrapper>
  );
};

export default AdvancedFilterContainer;

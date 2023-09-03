import React, { useCallback, useEffect, useState } from "react";
import { ApolloError } from "apollo-client";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";

import { isPackagePatternValid, formatPackageIdInput } from "./utils";
import {
  DoubleButtonWrapper,
  HEADER_ID,
  IconWrapper,
  InfoText,
  StyledCartOptionModal,
  StyledModalHeading,
} from "./sharedAdminComponents";
import AdminModalError from "./AdminModalError";

import WarningIcon from "components/icons/alert-triangle.svg";
import SearchIcon from "components/icons/search.svg";
import CheckCircleIcon from "components/icons/checks-circle.svg";
import LinkIcon from "components/icons/link.svg";
import Column from "components/ui/Grid/Column";
import Row from "components/ui/Grid/Row";
import Button from "components/ui/Inputs/Button";
import { column, DefaultMarginTop, mqMin } from "styles/base";
import { gutters, separatorColor, whiteColor } from "styles/variables";
import AutocompleteInput, {
  ContentDropdownStyled,
} from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { AutoCompleteType } from "types/enums";
import InputWrapper from "components/ui/InputWrapper";
import { DropdownContainer } from "components/ui/Inputs/ContentDropdown";
import { typographyBody2 } from "styles/typography";
import useOnDidMount from "hooks/useOnDidMount";
import Tooltip from "components/ui/Tooltip/Tooltip";

const StyledDoubleButtonWrapper = styled(DoubleButtonWrapper)(() => DefaultMarginTop);

const PackageSummary = styled.div`
  ${typographyBody2}
  margin: ${gutters.small}px -${gutters.small}px 0 -${gutters.small}px;
  padding-right: ${gutters.large}px;
  padding-left: ${gutters.large}px;
`;

const BubblesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
`;

const StyledButton = styled(Button, {
  shouldForwardProp: () => true,
})`
  margin-bottom: ${gutters.small}px;

  ${mqMin.large} {
    margin-bottom: 0;
    width: 85%;
  }
`;

const StyledTooltip = styled(Tooltip)`
  ${mqMin.large} {
    justify-content: flex-end;
  }
`;

const StyledAutocompleteInput = styled(AutocompleteInput)(
  () => css`
    ${ContentDropdownStyled} {
      ${DropdownContainer} {
        max-height: 120px;
        overflow: scroll;
      }
    }
  `
);

const ContentWrapper = styled.div`
  min-height: 200px;
`;

const LinkIconWrapper = styled.span`
  display: inline-block;
  margin-left: ${gutters.small / 2}px;

  svg {
    width: 14px;
    height: 14px;
    fill: ${whiteColor};
  }
`;

const ColumnWithTopSpacing = styled.div<{
  shouldSkipBorder?: boolean;
  columnSizes?: SharedTypes.ColumnSizes;
}>(({ shouldSkipBorder, columnSizes }) => [
  column(columnSizes ?? { small: 7 / 10 }, true),
  css`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    border-bottom: 1px solid ${shouldSkipBorder ? "transparent" : separatorColor};
    padding: ${gutters.small}px;
    a {
      width: auto;
      min-width: 150px;
    }
  `,
]);

const ConnectPackageModal = ({
  onToggleModal,
  connectToPackage,
  isLoading,
  connectToPackageError,
  fetchSimilarPackageList,
  similarPackageList,
  fetchSimilarPackagesError,
  previousSearchTerm,
  fetchSelectedPackageDetails,
  selectedPackageDetails,
  isFetchPackageDetailsLoading,
  isFetchSimilarPackagesLoading,
  fetchPackageDetailsError,
  onDismissConnectToPackageError,
  onRefetchCartData,
  isConnectToPackageSuccessful,
}: {
  onToggleModal: () => void;
  isLoading: boolean;
  previousSearchTerm?: string;
  similarPackageList?: SharedTypes.AutocompleteItem[];
  fetchSimilarPackageList: (packageSearchString: string) => void;
  fetchSimilarPackagesError?: ApolloError;
  connectToPackage: (packageId: string) => void;
  connectToPackageError?: ApolloError;
  fetchSelectedPackageDetails: (packageId: string) => void;
  selectedPackageDetails?: CartTypes.ChosenPackageDetailsSection[];
  isFetchPackageDetailsLoading?: boolean;
  isFetchSimilarPackagesLoading?: boolean;
  fetchPackageDetailsError?: ApolloError;
  onDismissConnectToPackageError: () => void;
  onRefetchCartData: () => void;
  isConnectToPackageSuccessful: boolean;
}) => {
  const [selectedPackage, setSelectedPackage] = useState<SharedTypes.AutocompleteItem>();
  const theme: Theme = useTheme();
  const hasQueryError =
    !isConnectToPackageSuccessful &&
    Boolean(connectToPackageError || fetchSimilarPackagesError || fetchPackageDetailsError);

  const handleSetPackageId = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPackageIdInput(event.target.value);
      // eslint-disable-next-line functional/immutable-data, no-param-reassign
      event.target.value = formattedValue;
      // We automatically add the prefix 'T-' so when the value.length < 2, it's only the prefix
      if (!formattedValue || formattedValue.length <= 2) setSelectedPackage(undefined);
      setTimeout(() => {
        fetchSimilarPackageList(formattedValue);
      }, 300);
    },
    [fetchSimilarPackageList]
  );

  const handleSelectPackageId = useCallback(
    (item?: SharedTypes.AutocompleteItem) => {
      setSelectedPackage(item);
      if (item?.id) {
        fetchSelectedPackageDetails(item.id);
      }
    },
    [fetchSelectedPackageDetails]
  );

  const handleConnectCartToPackage = useCallback(() => {
    if (selectedPackage) {
      connectToPackage(selectedPackage.id);
    }
  }, [connectToPackage, selectedPackage]);

  const onUpdateCartDataAndClose = useCallback(() => {
    onRefetchCartData();
    onToggleModal();
  }, [onToggleModal, onRefetchCartData]);

  useOnDidMount(() => {
    if (selectedPackageDetails?.length && previousSearchTerm?.length) {
      const bookingID = selectedPackageDetails.find(item => item.title === "Booking number");
      if (bookingID) {
        setSelectedPackage({ id: bookingID.value.slice(2), name: bookingID.value });
      }
    }
  });

  useEffect(() => {
    if (connectToPackageError) {
      document.getElementById(HEADER_ID)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [connectToPackageError]);

  return (
    <StyledCartOptionModal
      id="connectToPackageModal"
      onClose={isConnectToPackageSuccessful ? onUpdateCartDataAndClose : onToggleModal}
      title="Connect to a package"
      isError={hasQueryError}
    >
      <StyledModalHeading isError={hasQueryError} theme={theme} id={HEADER_ID}>
        Add this cart to an existing package
      </StyledModalHeading>
      {isConnectToPackageSuccessful ? (
        <InfoText>
          <IconWrapper isSuccessful isLargeIcon>
            <CheckCircleIcon />
          </IconWrapper>
          This cart was successfully connected to the package
          {selectedPackage?.name ? <strong>&nbsp;{selectedPackage?.name}&nbsp;</strong> : ""}.
        </InfoText>
      ) : (
        <>
          {connectToPackageError && (
            <AdminModalError
              onDismissError={onDismissConnectToPackageError}
              isDismissable
              useGenericErrorMessage
              apolloError={connectToPackageError}
            />
          )}
          <ContentWrapper>
            <Row>
              <Column>
                <InputWrapper
                  id="connect-to-package-wrapper"
                  label="Search for the package ID (numbers only)"
                  hasError={Boolean(fetchSimilarPackagesError)}
                  customErrorMessage="An error has occurred while fetching the tour list."
                >
                  <StyledAutocompleteInput
                    id="connect-to-package-autocomplete"
                    useProduct
                    debounceWaitTime={0}
                    ListIcon={SearchIcon}
                    onInputChange={handleSetPackageId}
                    placeholder="T-XXXXX"
                    defaultValue={previousSearchTerm}
                    selectFirstOnBlur={false}
                    defaultAutocompleteIconType={AutoCompleteType.PRODUCT}
                    listItems={similarPackageList}
                    onItemClick={handleSelectPackageId}
                    hasError={Boolean(fetchSimilarPackagesError)}
                    isInputLoading={isFetchSimilarPackagesLoading}
                    disableAutoSelectProductOnKeyDown
                    onKeyPress={e => {
                      if (!isPackagePatternValid(e.key, e.currentTarget.value)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </InputWrapper>
              </Column>
            </Row>
            <PackageSummary>
              {fetchPackageDetailsError && (
                <AdminModalError>
                  <Column>
                    <InfoText>
                      <IconWrapper>
                        <WarningIcon />
                      </IconWrapper>
                      There was an error fetching the package details
                    </InfoText>
                    <InfoText>
                      <strong>
                        {fetchPackageDetailsError?.networkError?.message ||
                          fetchPackageDetailsError?.message}
                      </strong>
                    </InfoText>
                  </Column>
                </AdminModalError>
              )}
              {isFetchPackageDetailsLoading && (
                <BubblesWrapper>
                  <Bubbles color="primary" theme={theme} size="small" />
                </BubblesWrapper>
              )}
              {selectedPackageDetails?.length && selectedPackage && (
                <>
                  {selectedPackageDetails.map((section, index) => {
                    const shouldSkipBorder = index === selectedPackageDetails.length - 1;
                    return (
                      <Row key={section.title + index.toString()}>
                        <ColumnWithTopSpacing
                          columnSizes={{ small: 3 / 10 }}
                          shouldSkipBorder={shouldSkipBorder}
                        >
                          <strong>
                            {index === 0 ? <big>{section.title}</big> : section.title}
                          </strong>
                        </ColumnWithTopSpacing>
                        {section.url ? (
                          <ColumnWithTopSpacing shouldSkipBorder={shouldSkipBorder}>
                            <Button
                              theme={theme}
                              color="action"
                              id={`tour-link-${index}`}
                              href={section.url}
                              target="_blank"
                            >
                              {section.value}
                              <LinkIconWrapper>
                                <LinkIcon />
                              </LinkIconWrapper>
                            </Button>
                          </ColumnWithTopSpacing>
                        ) : (
                          <ColumnWithTopSpacing
                            dangerouslySetInnerHTML={{ __html: section.value }}
                            shouldSkipBorder={shouldSkipBorder}
                          />
                        )}
                      </Row>
                    );
                  })}
                </>
              )}
            </PackageSummary>
          </ContentWrapper>
        </>
      )}
      <StyledDoubleButtonWrapper>
        <StyledButton
          theme={theme}
          onClick={isConnectToPackageSuccessful ? onUpdateCartDataAndClose : onToggleModal}
          disabled={isLoading}
        >
          Close
        </StyledButton>
        <StyledTooltip title="Please select a package first" fullWidth isVisible={!selectedPackage}>
          <StyledButton
            theme={theme}
            color="action"
            onClick={handleConnectCartToPackage}
            disabled={isLoading || !selectedPackage || isConnectToPackageSuccessful}
          >
            Confirm
          </StyledButton>
        </StyledTooltip>
      </StyledDoubleButtonWrapper>
    </StyledCartOptionModal>
  );
};

export default ConnectPackageModal;

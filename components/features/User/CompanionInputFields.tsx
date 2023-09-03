import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { UserInfo } from "./types/userTypes";

import SingleUserForm from "components/ui/User/SingleUserForm";
import { gutters } from "styles/variables";

const CompanionWrapper = styled.div<{}>(
  ({ theme }) => css`
    margin-top: ${gutters.large}px;
    border-bottom: 2px solid ${rgba(theme.colors.primary, 0.2)};
    padding-bottom: ${gutters.large}px;
  `
);

const CompanionInputFields = ({
  companions,
  handleCompanionInfoChanged,
  onImageUpload,
}: {
  companions: UserInfo[];
  handleCompanionInfoChanged: (userId: string, updatedInfo: Partial<UserInfo>) => void;
  onImageUpload: (fileToUpload: File, isMainUser?: boolean, companionId?: string) => void;
}) => {
  return (
    <>
      {companions.map((companion: UserInfo) => {
        return (
          <CompanionWrapper key={`frequenttraveler${companion.id}`}>
            <SingleUserForm
              user={companion}
              companionId={companion.id}
              handleUserInfoChanged={handleCompanionInfoChanged}
              formId={`travel-companion-${companion.id}`}
              onImageUpload={onImageUpload}
            />
          </CompanionWrapper>
        );
      })}
    </>
  );
};

export default CompanionInputFields;

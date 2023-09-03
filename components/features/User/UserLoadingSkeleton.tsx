import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import { StyledColumn } from "../Cart/CartPassengerDetailsForm";

import { UsercontentContainer } from "./UserContent";
import { ImageNameWrapper } from "./ProfilePictureWithName";

import { skeletonPulse } from "styles/base";
import { borderRadiusBig, borderRadiusCircle, borderRadiusSmall, gutters } from "styles/variables";
import Section from "components/ui/Section/Section";
import { DesktopContainer, MobileContainer } from "components/ui/Grid/Container";
import ProductHeader from "components/ui/ProductHeader";
import Row from "components/ui/Grid/Row";

const TextInputSkeleton = styled.div([
  skeletonPulse,
  css`
    align-self: center;
    margin-top: ${gutters.small}px;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    border-radius: ${borderRadiusSmall};
    width: 100%;
    height: 45px;
  `,
]);

const ProfilePictureSkeleton = styled.div([
  skeletonPulse,
  css`
    margin-right: ${gutters.large / 2}px;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    border-radius: ${borderRadiusCircle};
    width: 65px;
    height: 65px;
  `,
]);

export const HeadingSkeleton = styled.div<{
  width: number;
}>([
  skeletonPulse,
  ({ width }) => css`
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    border-radius: 5px;
    width: ${width}px;
    height: 28px;
  `,
]);

const GenderSkeleton = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small}px;
    width: 33%;
    height: 25px;
  `,
]);

const AddButtonSkeleton = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small}px;
    border-radius: ${borderRadiusBig};
    width: 60px;
    height: 16px;
  `,
]);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserFormSkeleton = () => {
  return (
    <Section id="main-userinfo">
      <MobileContainer>
        <ImageNameWrapper>
          <ProfilePictureSkeleton />
          <HeadingSkeleton width={100} />
        </ImageNameWrapper>
        <Row key="userfieldsskeleton">
          <StyledColumn>
            <TextInputSkeleton />
            <GenderSkeleton />
          </StyledColumn>
          <StyledColumn>
            <TextInputSkeleton />
          </StyledColumn>
        </Row>
        <Row key="userfieldsskeleton1">
          <StyledColumn>
            <TextInputSkeleton />
          </StyledColumn>
          <StyledColumn>
            <TextInputSkeleton />
          </StyledColumn>
        </Row>
        <Row key="userfieldsskeleton2">
          <StyledColumn>
            <TextInputSkeleton />
          </StyledColumn>
          <StyledColumn>
            <TextInputSkeleton />
          </StyledColumn>
        </Row>
      </MobileContainer>
    </Section>
  );
};

const UserLoadingSkeleton = ({ t }: { t: TFunction }) => {
  return (
    <DesktopContainer>
      <ProductHeader title={t("My profile")} />
      <UsercontentContainer>
        <UserFormSkeleton />
        <Section>
          <Wrapper>
            <HeadingSkeleton width={280} />
            <AddButtonSkeleton />
          </Wrapper>
        </Section>
        <Section>
          <HeadingSkeleton width={140} />
        </Section>
      </UsercontentContainer>
    </DesktopContainer>
  );
};

export default UserLoadingSkeleton;

import { css } from "@emotion/core";
import styled from "@emotion/styled";
import Input from "@travelshift/ui/components/Inputs/Input";
import rgba from "polished/lib/color/rgba";
import UserIcon from "@travelshift/ui/icons/user.svg";

import Link from "components/ui/Link";
import { anchor, mqMin } from "styles/base";
import { typographyCaption, typographySubtitle2 } from "styles/typography";
import { blackColor, greyColor, gutters, whiteColor } from "styles/variables";
import { resetButton } from "styles/reset";

export const StyledInput = styled(Input)`
  padding: 10px 12px;
  font-size: 16px;
  ${mqMin.desktop} {
    height: 40px;
    padding: 12px 16px;
    font-size: 14px;
  }
`;

export const FormLoginRow = styled.div`
  width: 100%;
`;

export const FormRow = styled(FormLoginRow)`
  margin-top: ${gutters.small * 2}px;
`;

export const SocialWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const SocialMediaTitle = styled.div<{}>(({ theme }) => [
  typographySubtitle2,
  css`
    margin-top: ${gutters.small / 4}px;
    color: ${theme.colors.primary};
  `,
]);

export const SocialMediaButton = styled.div<{}>(
  ({ theme }) =>
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px -1px 4px ${rgba(blackColor, 0.1)}, 0px 1px 4px ${rgba(blackColor, 0.1)};
      border-radius: 50%;
      width: 42px;
      height: 42px;
      background-color: ${theme.colors.primary};
    `
);

export const SocialMediaWhiteButton = styled(SocialMediaButton)`
  background-color: ${whiteColor};
`;

export const SocialIconStyles = css`
  width: 65%;
  height: 65%;
`;

export const FormButtonRow = styled(FormLoginRow)`
  margin-top: ${gutters.large}px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const BottomContent = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${gutters.small / 4}px;
  width: 100%;
`;

export const StyledLink = styled(Link)(({ theme }) => [
  anchor,
  typographyCaption,
  css`
    margin-top: ${gutters.small}px;
    color: ${theme.colors.primary};
    &:after {
      background: currentColor;
    }
  `,
]);

export const Social = styled.div`
  margin-top: ${gutters.large}px;
  text-align: center;
`;

export const SocialText = styled.span<{}>(({ theme }) => [
  typographySubtitle2,
  css`
    color: ${theme.colors.primary};
  `,
]);

export const ModalBottomContent = styled.div`
  margin-top: ${gutters.small}px;
  text-align: center;
`;

export const BottomContentText = styled.span(
  typographyCaption,
  css`
    color: ${rgba(greyColor, 0.7)};
  `
);

export const BottomContentButton = styled.button<{}>(({ theme }) => [
  anchor,
  typographyCaption,
  css`
    color: ${theme.colors.primary};
    &:after {
      background: currentColor;
    }
  `,
]);

export const BottomText = styled.div`
  margin-top: ${gutters.small}px;
`;

export const PopoverButton = styled.button(
  resetButton,
  css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 100%;
  `
);

export const StyledUserIcon = styled(UserIcon)(
  ({ theme }) => css`
    width: 20px;
    height: 20px;
    fill: ${theme.colors.primary};
  `
);

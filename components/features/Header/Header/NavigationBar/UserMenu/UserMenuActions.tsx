import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import Arrow from "@travelshift/ui/icons/arrow.svg";
import VoucherIcon from "@travelshift/ui/icons/voucher.svg";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";

import Signout from "./Signout";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { gutters, whiteColor, borderRadius } from "styles/variables";
import { clearPreviewCookie } from "utils/cookieUtils";
import Row from "components/ui/Grid/Row";
import { column, mqMin } from "styles/base";
import { typographySubtitle2 } from "styles/typography";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import IconLoading from "components/ui/utils/IconLoading";
import ClientLink from "components/ui/ClientLink";
import Link from "components/ui/Link";
import ImageComponent from "components/ui/ImageComponent";

const MessageIcon = CustomNextDynamic(() => import("components/icons/alarm-bell-1.svg"), {
  loading: IconLoading,
});
const BookingsIcon = CustomNextDynamic(() => import("components/icons/credit-card-check.svg"), {
  loading: IconLoading,
});
const AdminPanelIcon = CustomNextDynamic(() => import("components/icons/cog-browser.svg"), {
  loading: IconLoading,
});
const PackagesIcon = CustomNextDynamic(() => import("components/icons/distance.svg"), {
  loading: IconLoading,
});
const BlogsIcon = CustomNextDynamic(() => import("components/icons/book-open.svg"), {
  loading: IconLoading,
});
const OutlineStarIcon = CustomNextDynamic(() => import("components/icons/award-star-head.svg"), {
  loading: IconLoading,
});

export const Wrapper = styled.div`
  width: 100%;
  ${mqMin.large} {
    width: 340px;
  }
`;

const Column = styled.div<{ columns?: SharedTypes.ColumnSizes }>(
  ({ columns = { small: 1 / 3 } }) => [
    column(columns),
    css`
      margin-top: ${gutters.small}px;
    `,
  ]
);

const buttonStyles = (theme: Theme) => [
  typographySubtitle2,
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: ${borderRadius};
    width: 100%;
    height: 72px;
    background-color: ${rgba(theme.colors.primary, 0.05)};
    color: ${theme.colors.primary};
  `,
];

export const LinkButton = styled(Link)(({ theme }) => buttonStyles(theme));

export const LinkButtonClientLink = styled(ClientLink)(({ theme }) => buttonStyles(theme));

export const Button = styled.button(({ theme }) => buttonStyles(theme));

export const IconWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    border: 2px solid ${whiteColor};
    border-radius: 50%;
    width: 36px;
    height: 36px;
    background-color: ${theme.colors.primary};
  `
);

export const iconStyles = css`
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const ImageComponentStyled = styled(ImageComponent)`
  margin-bottom: 4px;
  border: 2px solid ${whiteColor};
  border-radius: 50%;
  width: 36px;
  height: 36px;
`;

export const AvatarImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) => {
  return (
    <ImageComponentStyled
      className={className}
      width={36}
      height={36}
      imageAlt={alt}
      imageUrl={src}
      lazy={false}
    />
  );
};

export const StyledRow = styled(Row)`
  margin-top: -${gutters.large / 2}px;
`;

const GTIMenuContent = ({
  isAdmin,
  userId,
  userMenuTexts,
  adminUrl,
  showExitPreviewButton,
  avatarImage,
}: {
  isAdmin: boolean;
  userId: number;
  userMenuTexts: HeaderTypes.UserMenuTexts;
  adminUrl: string;
  showExitPreviewButton?: boolean;
  avatarImage?: Image;
}) => {
  const isMobile = useIsMobile();
  const profileUrl = `${adminUrl}/${isAdmin ? `users/form/${userId}` : "locals/form"}`;

  return (
    <Wrapper>
      <StyledRow>
        <Column columns={{ small: isAdmin ? 1 / 3 : 1 }}>
          <LinkButton href={profileUrl}>
            {avatarImage ? (
              <AvatarImage src={avatarImage.url} alt={avatarImage.name} />
            ) : (
              <IconWrapper>
                <BookingsIcon css={iconStyles} />
              </IconWrapper>
            )}
            Profile
          </LinkButton>
        </Column>
        {isAdmin ? (
          <>
            <Column>
              <LinkButton href={adminUrl}>
                <IconWrapper>
                  <AdminPanelIcon css={iconStyles} />
                </IconWrapper>
                Dashboard
              </LinkButton>
            </Column>
            <Column>
              <LinkButton href={`${adminUrl}/messages`}>
                <IconWrapper>
                  <MessageIcon css={iconStyles} />
                </IconWrapper>
                {userMenuTexts.messages}
              </LinkButton>
            </Column>
            <Column>
              <LinkButton href={`${adminUrl}/bookings`}>
                <IconWrapper>
                  <BookingsIcon css={iconStyles} />
                </IconWrapper>
                {userMenuTexts.bookings}
              </LinkButton>
            </Column>
            <Column>
              <LinkButton
                href={`${adminUrl}/bookings/itineraries?&status=unassigned&complete=incomplete`}
              >
                <IconWrapper>
                  <PackagesIcon css={iconStyles} />
                </IconWrapper>
                {userMenuTexts.packages}
              </LinkButton>
            </Column>
            <Column>
              <LinkButton href={`${adminUrl}/locals/blogs/list?created_time=newest"`}>
                <IconWrapper>
                  <BlogsIcon css={iconStyles} />
                </IconWrapper>
                {userMenuTexts.blogs}
              </LinkButton>
            </Column>
            <Column>
              <LinkButton href={`${adminUrl}/reviews`}>
                <IconWrapper>
                  <OutlineStarIcon css={iconStyles} />
                </IconWrapper>
                {userMenuTexts.reviews}
              </LinkButton>
            </Column>
            {showExitPreviewButton && (
              <Column>
                <Button
                  onClick={() => {
                    clearPreviewCookie();
                    window.location.reload();
                  }}
                >
                  <IconWrapper>
                    <Arrow css={iconStyles} />
                  </IconWrapper>
                  Exit preview
                </Button>
              </Column>
            )}
          </>
        ) : (
          <>
            <Column columns={{ small: 1 / 2 }}>
              <LinkButton href={`${adminUrl}/locals/blogs/form`}>
                <IconWrapper>
                  <BlogsIcon css={iconStyles} />
                </IconWrapper>
                {userMenuTexts.createBlog}
              </LinkButton>
            </Column>
            <Column columns={{ small: 1 / 2 }}>
              <LinkButton href={`${adminUrl}/vouchers`}>
                <IconWrapper>
                  <VoucherIcon css={iconStyles} />
                </IconWrapper>
                {userMenuTexts.vouchers}
              </LinkButton>
            </Column>
          </>
        )}
      </StyledRow>
      {!isMobile && <Signout signOutText={userMenuTexts.signOut} href="/logout" />}
    </Wrapper>
  );
};

export default GTIMenuContent;

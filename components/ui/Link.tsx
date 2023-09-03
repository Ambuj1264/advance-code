/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactNode } from "react";
import NextLink from "next/link";

type Props = {
  as?: string;
  href: string;
  children?: ReactNode;
};

const Link = ({ as, href, children, ...props }: Props) => (
  <NextLink as={as} href={href}>
    <a {...props}>{children}</a>
  </NextLink>
);

export default Link;

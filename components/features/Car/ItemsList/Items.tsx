import React, { Fragment } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { typographyBody2, typographySubtitle1 } from "styles/typography";
import { gutters, greyColor } from "styles/variables";

const ModalContentTitleWrapper = styled.div([
  typographySubtitle1,
  css`
    margin-bottom: ${gutters.small / 2}px;
    color: ${greyColor};
  `,
]);

const ModalContentBodyWrapper = styled.p([
  typographyBody2,
  css`
    margin-bottom: ${gutters.small}px;
    color: ${greyColor};
    &:last-of-type {
      padding-bottom: ${gutters.small / 2}px;
    }
  `,
]);

const Items = ({ items }: { items: SharedTypes.Icon[] }) => {
  const displayTitle = items.length > 1;
  return (
    <>
      {items.map(item => (
        <Fragment key={item.id}>
          {displayTitle && <ModalContentTitleWrapper>{item.title}</ModalContentTitleWrapper>}
          <ModalContentBodyWrapper>
            <div>{item.description}</div>
            {item.details}
          </ModalContentBodyWrapper>
        </Fragment>
      ))}
    </>
  );
};

export default Items;

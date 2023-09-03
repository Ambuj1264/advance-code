import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import useToggle from "hooks/useToggle";
import { cover } from "styles/base";
import { borderRadiusSmall } from "styles/variables";

type Props = {
  mapUrl: string;
};

const Wrapper = styled.div`
  position: relative;
`;

const Overlay = styled.div([
  cover,
  css`
    cursor: grab;
  `,
]);

const Iframe = styled.iframe`
  margin: 0;
  border: none;
  border-radius: ${borderRadiusSmall};
  width: 100%;
  overflow: hidden;
`;

const Map = ({ mapUrl }: Props) => {
  const [clicked, toggleClicked] = useToggle(false);
  return (
    <Wrapper>
      <>
        <Iframe className="lazyload" height="480" title="Tour map" data-src={mapUrl} />
        {!clicked && <Overlay onClick={() => toggleClicked()} />}
      </>
    </Wrapper>
  );
};

export default Map;

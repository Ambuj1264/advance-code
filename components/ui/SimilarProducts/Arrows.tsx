import React from "react";
import styled from "@emotion/styled";

const Arrow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  :before {
    content: "";
    position: absolute;
    top: 0;
    width: 12px;
    height: 50%;
  }
  :after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 12px;
    height: 50%;
  }
`;

const FirstArrow = styled(Arrow)`
  width: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  :before {
    left: 8px;
    background: linear-gradient(to right top, rgba(255, 255, 255, 0.1) 50%, rgba(0, 0, 0, 0) 50%);
  }
  :after {
    left: 8px;
    background: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(0, 0, 0, 0) 50%
    );
  }
`;

const SecondArrow = styled(Arrow)`
  width: 20px;
  background-color: rgba(255, 255, 255, 0.08);
  :before {
    left: 20px;
    background: linear-gradient(to right top, rgba(255, 255, 255, 0.08) 50%, rgba(0, 0, 0, 0) 50%);
  }
  :after {
    left: 20px;
    background: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(0, 0, 0, 0) 50%
    );
  }
`;

const Arrows = () => (
  <>
    <FirstArrow />
    <SecondArrow />
  </>
);

export default Arrows;

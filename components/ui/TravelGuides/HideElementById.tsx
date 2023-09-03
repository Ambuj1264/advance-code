import Head from "next/head";
import React from "react";

const HideElementById = ({ elementId }: { elementId: string }) => {
  return (
    <Head>
      <style key={elementId}>
        {`
          #${elementId} {
            display: none;
          }
        `}
      </style>
    </Head>
  );
};

export default HideElementById;

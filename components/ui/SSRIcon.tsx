import React from "react";

const SSRIcon =
  (svgAsString: string) =>
  ({ className }: { className: string }) =>
    (
      <div
        className={className}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: svgAsString,
        }}
      />
    );

export default SSRIcon;

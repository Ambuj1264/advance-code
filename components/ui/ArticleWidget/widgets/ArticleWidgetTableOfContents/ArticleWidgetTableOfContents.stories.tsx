/* eslint-disable import/order, import/no-unresolved */
import React from "react";
import { object } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

import ArticleWidgetTableOfContents from "./ArticleWidgetTableOfContents";
import ArticleWidgetTableOfContentsMobile from "./ArticleWidgetTableOfContentsMobile";

import WithContainer from "@stories/decorators/WithContainer";

const heading = "Table of contents";

storiesOf(`${heading}/Desktop`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ArticleWidgetTableOfContents
      items={object("items", [
        { caption: "Heading2", level: 0, link: "", prefix: "1." },
        { caption: "Heading3", level: 1, link: "", prefix: "1.1" },
        { caption: "Heading3", level: 1, link: "", prefix: "1.2" },
        { caption: "Heading2", level: 0, link: "", prefix: "2." },
        { caption: "Heading3", level: 1, link: "", prefix: "2.1" },
        { caption: "Heading3", level: 1, link: "", prefix: "2.2" },
      ])}
    />
  ));

storiesOf(`${heading}/Mobile`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ArticleWidgetTableOfContentsMobile
      items={object("items", [
        { caption: "Heading2", level: 0, link: "", prefix: "1." },
        { caption: "Heading3", level: 1, link: "", prefix: "1.1" },
        { caption: "Heading3", level: 1, link: "", prefix: "1.2" },
        { caption: "Heading2", level: 0, link: "", prefix: "2." },
        { caption: "Heading3", level: 1, link: "", prefix: "2.1" },
        { caption: "Heading3", level: 1, link: "", prefix: "2.2" },
      ])}
    />
  ));

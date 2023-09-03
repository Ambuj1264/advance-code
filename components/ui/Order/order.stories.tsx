import React from "react";
import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";

import {
  SectionHeader,
  SectionLabel,
  SectionValue,
  VoucherSection,
  SectionContainer,
  SectionSeperator,
} from "./OrderComponents";

import { mockTheme } from "utils/mockData/mockGlobalData";

const heading = "Voucher";

storiesOf(`${heading}`, module).add("SectionHeader", () => {
  return (
    <SectionHeader color={mockTheme.colors.primary}>
      {text("heading", "Booking details")}
    </SectionHeader>
  );
});

storiesOf(`${heading}`, module).add("SectionLabel", () => {
  return <SectionLabel>{text("label", "Booking number")}</SectionLabel>;
});

storiesOf(`${heading}`, module).add("SectionValue", () => {
  return <SectionValue>{text("value", "A19231204123T")}</SectionValue>;
});

const mockInformation = {
  title: "Service Details",
  sections: [
    {
      label: "Duration",
      values: ["6 nights"],
    },
    {
      label: "Travellers",
      values: ["2 adults"],
    },
    {
      label: "Departure date",
      values: ["20 June, 2021 at 16:00"],
    },
    {
      label: "Depart from",
      values: ["Newark Liberty International (EWR)"],
    },
    {
      label: "Arrival date",
      values: ["22 June, 2021 at 17:40"],
    },
    {
      label: "Arrival to",
      values: ["Keflavík International Airport"],
    },
    {
      label: "Return date",
      values: ["24 June, 2021 at 17:40"],
    },
    {
      label: "Return from",
      values: ["Keflavík International Airport"],
    },
    {
      label: "Arrival date",
      values: ["26 June, 2021 at 17:40"],
    },
    {
      label: "Arrival to",
      values: ["Newark Liberty International (EWR)"],
    },
    {
      label: "Bags",
      values: [
        "Cabin bag x2: 40 × 30 × 20 cm — 10 kg",
        "Checked luggage x 1: 78 × 28 × 52 cm — 20 kg ",
      ],
    },
  ],
};

storiesOf(`${heading}/VoucherSection`, module).add("Default", () => {
  return <VoucherSection voucherSection={mockInformation} />;
});

storiesOf(`${heading}/VoucherSection`, module).add(
  "With SectionContainer",
  () => {
    return (
      <SectionContainer>
        <VoucherSection voucherSection={mockInformation} />
      </SectionContainer>
    );
  }
);

storiesOf(`${heading}/VoucherSection`, module).add(
  "2 sections With SectionContainer",
  () => {
    return (
      <SectionContainer>
        <VoucherSection voucherSection={mockInformation} />
        <SectionSeperator />
        <VoucherSection
          voucherSection={{
            title: "Price details",
            sections: [
              {
                label: "Pay now",
                values: ["185,000 ISK"],
              },
              {
                label: "Pay on location",
                values: [
                  "2,000 ISK - Young driver fee",
                  "2,000 ISK - One way fee",
                ],
              },
              {
                label: "Total",
                values: ["189,000 ISK"],
              },
            ],
          }}
        />
      </SectionContainer>
    );
  }
);

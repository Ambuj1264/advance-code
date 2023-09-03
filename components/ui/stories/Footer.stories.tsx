/* eslint-disable import/order, import/no-unresolved */
import React from "react";
import Footer from "@travelshift/ui/components/Footer/Footer";

import { storiesOf } from "@storybook/react";
import { getSocialMediaItems } from "components/features/Footer/footerUtils";
import Container, {
  DesktopContainer,
  MobileContainer,
} from "components/ui/Grid/Container";

const heading = "Footer";

const columns = [
  {
    sections: [
      {
        title: "Guide to Iceland",
        items: [
          {
            type: "link" as const,
            text: "About us",
            url: "/pages/about-us",
          },
          {
            type: "link" as const,
            text: "Awards",
            url: "/pages/awards",
          },
          {
            type: "link" as const,
            text: "Terms & conditions",
            url: "/pages/terms-and-conditions",
          },
          {
            type: "link" as const,
            text: "Copyright & privacy",
            url: "/pages/copyright-and-privacy",
          },
        ],
      },
      {
        title: "Address",
        items: [
          {
            type: "text" as const,
            text: "Borgartún 26",
          },
          {
            type: "text" as const,
            text: "105 Reykjavík",
          },
          {
            type: "link" as const,
            text: "+354 519 79 99",
            url: "tel:+3545197999",
          },
          {
            type: "link" as const,
            text: "info@guidetoiceland.is",
            url: "mailto:info@guidetoiceland.is",
          },
        ],
      },
      {
        items: [
          {
            type: "socialmedia" as const,
            text: "facebook",
            url: "https://www.facebook.com/guidetoiceland.is/",
          },
          {
            type: "socialmedia" as const,
            text: "instagram",
            url: "https://www.instagram.com/guidetoiceland/",
          },
          {
            type: "socialmedia" as const,
            text: "tripadvisor",
            url:
              "https://www.tripadvisor.com/Attraction_Review-g189970-d7788374-Reviews-Guide_to_Iceland-Reykjavik_Capital_Region.html",
          },
          {
            type: "socialmedia" as const,
            text: "twitter",
            url: "https://twitter.com/guidetoiceland",
          },
          {
            type: "socialmedia" as const,
            text: "weibo",
            url: "https://www.weibo.com/guidetoiceland",
          },
          {
            type: "socialmedia" as const,
            text: "youtube",
            url: "https://www.youtube.com/channel/UC-8RFAZFxKGXZlgp9jc2jRw",
          },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "Type of travel",
        items: [
          {
            type: "link" as const,
            text: "Tours & Packages",
            url: "/book-trips-holiday",
          },
          {
            type: "link" as const,
            text: "Self drive tours",
            url: "/self-drive-tours",
          },
          {
            type: "link" as const,
            text: "Family Trips",
            url: "/pages/family-trips",
          },
          {
            type: "link" as const,
            text: "Group Travel",
            url: "/pages/group-travel",
          },
          {
            type: "link" as const,
            text: "Luxury Travel",
            url: "/pages/luxury-travel",
          },
          {
            type: "link" as const,
            text: "Business Travel",
            url: "/pages/business-travel",
          },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "Explore Iceland",
        items: [
          {
            type: "link" as const,
            text: "Iceland forum",
            url: "https://forum.guidetoiceland.is",
          },
          {
            type: "link" as const,
            text: "Nature In Iceland",
            url: "/nature-info",
          },
          {
            type: "link" as const,
            text: "Travel Information",
            url: "/travel-info",
          },
          {
            type: "link" as const,
            text: "Reykjavik Guide",
            url: "/reykjavik-guide",
          },
          {
            type: "link" as const,
            text: "History & Culture",
            url: "/history-culture",
          },
          {
            type: "link" as const,
            text: "Music In Iceland",
            url: "/music-of-iceland",
          },
          {
            type: "link" as const,
            text: "The Northern Lights",
            url: "/the-northern-lights",
          },
          {
            type: "link" as const,
            text: "Best of Iceland",
            url: "/best-of-iceland",
          },
          {
            type: "link" as const,
            text: "Itineraries",
            url: "/you-guide",
          },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "Special Requests",
        items: [
          {
            type: "link" as const,
            text: "Travel Agents",
            url: "https://guidetoiceland.is/pages/travel-agent-contact",
          },
          {
            type: "link" as const,
            text: "Media production",
            url: "/pages/media-production",
          },
          {
            type: "link" as const,
            text: "DMC & incentives",
            url: "/pages/dmc-and-incentives",
          },
          {
            type: "link" as const,
            text: "Media support & sponsorship",
            url: "https://guidetoiceland.is/pages/media-and-press-work-with-us",
          },
          {
            type: "link" as const,
            text: "Car Rental",
            url: "/iceland-car-rentals",
          },
          {
            type: "link" as const,
            text: "Weddings & honeymoons",
            url: "/pages/weddings-and-events",
          },
        ],
      },
      {
        title: "Join our team",
        items: [
          {
            type: "link" as const,
            text: "Become a local contact",
            url: "/pages/local",
          },
          {
            type: "link" as const,
            text: "List your business & products",
            url: "/partners",
          },
          {
            type: "link" as const,
            text: "Work at Guide to Iceland",
            url: "https://guidetoiceland.is/pages/work-at-guide-to-iceland",
          },
          {
            type: "link" as const,
            text: "Markaðstorg ferðaþjónustunnar",
            url: "/markadstorg-ferdathjonustunnar",
          },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "Facebook page",
        items: [
          {
            type: "facebook_page" as const,
            text: "",
            url: "https://www.facebook.com/guidetoiceland.is/",
          },
        ],
      },
    ],
  },
];

storiesOf(`${heading}/Footer`, module).add("default", () => (
  <Footer
    columns={columns.slice(0, 4)}
    socialMediaLinks={getSocialMediaItems(columns)}
    theme={{
      colors: {
        primary: "#336699",
        action: "#33ab63",
      },
    }}
    Container={Container}
    DesktopContainer={DesktopContainer}
    MobileContainer={MobileContainer}
    socialMediaSectionText="Join us on social media"
  />
));

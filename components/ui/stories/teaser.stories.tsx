import { object, select, text } from "@storybook/addon-knobs";
import React from "react";
import { storiesOf } from "@storybook/react";
import WithContainer from "@stories/decorators/WithContainer";

import Teaser from "../Teaser/Teaser";
import TeaserImageTitleOnly from "../Teaser/variants/TeaserImageTitleOnly";
import TeaserImageDistanceReview from "../Teaser/variants/TeaserImageDistanceReview";
import TeaserImageWithAction from "../Teaser/variants/TeaserImageWithAction";
import { TeasersContainer } from "../TeaserList/variants/TeaserListVertical";
import TeaserCategoryBanner from "../Teaser/variants/TeaserCategoryBanner";

import {
  TeaserVariant,
  TeaserOverlayBannerIconId,
  CategoryBannerType,
} from "types/enums";
import TeaserSideCardWithButton from "components/ui/Teaser/variants/TeaserSideCardWithButton";
import TeaserSideCardHorizontal from "components/ui/Teaser/variants/TeaserSideCardHorizontal";
import TeaserOverlayBanner from "components/ui/Teaser/TeaserOverlayBanner";
import { ExternalLink } from "components/ui/Teaser/TeaserComponents";

const BasicTeaserSideCardHorizontalMockData = {
  id: "5520",
  url: "/",
  variant: TeaserVariant.VERTICAL_CARD,
  title:
    "Best Attractions by the Ring Road of Iceland and long-long-long title | Events, Tours and Nature",
  description:
    "What is it like to visit Iceland in January? Is it dark and cold? Where can you go, and what is there to do? Is it possible to see the northern lights? What kind of weather can you expect in January in Iceland? Continue reading for all there is to know about visiting Iceland in the depths of winter.   Explore the largest selection of Winter Self Drive Tours in Iceland  \tGet the most out of your travel experience by booking a Winter Package  \tSee Iceland's largest selection of Northern Lights Tours  \tRead about Iceland in February and Iceland in December  January is one of Iceland’s darkest and coldest months. The sun is only out for a few hours a day, the roads are icy, and the landscapes, more often than not, are covered in a metre of snow. Christmas festivities are quickly coming to a close, giving way to a lull in tourism, effectively making it one of Iceland´s quietest months.  Photo by Radka Valova  For those who dare to visit in a less conventional season, January delivers beautiful frosted landscapes, more hours of darkness to hunt for the northern lights, and fewer crowds at the places people want to see. Iceland in winter may not be the easiest place to negotiate, and harsh weather is common, but those with a little determination are sure to have an excellent winter holiday.  What to do in Iceland in January    Iceland is cold, snowy, and dark in January, but there's still a wealth of things to do. Multiple tours are still running, some of which are best in the depths of winter. As long as you make the most of the light hours, you won't find yourself short of exciting experiences.  Northern Lights in Iceland in January    Those coming to Iceland any time between September and April have a decent chance of seeing the Northern Lights. Those coming in January will have more opportunities than most to catch them, as there are only a few hours of sunlight . The sunrise and sunset times can be seen below.    \t\t\tSunrise Time \t\t\tSunset Time \t\t\tHours of Light \t\tJa...",
  image: {
    id: "351611",
    name: "pictures-of-snaefellsnes-peninsula-2.jpg",
    url:
      "https://guidetoiceland.imgix.net/350109/x/0/the-south-coast-of-iceland-4-jpg?auto=format%2Ccompress&ch=Width%2CDPR&dpr=1&ixlib=react-8.6.4&s=5e8bc04e33410cc45f3bf15d59296da6&fit=crop&h=240&w=540",
  },
};

storiesOf(`Components/Teaser`, module)
  .addDecorator(WithContainer)
  .add(
    "SideCard",
    () => (
      <Teaser
        variant={select(
          "variant",
          Object.values(TeaserVariant),
          TeaserVariant.SIDE_CARD
        )}
        url={text("url", "/")}
        title={text("title", "Things to do in Italy")}
        image={object("image", {
          url:
            "https://guidetoiceland.imgix.net/450701/x/0/what-to-do-amp-where-to-go-1.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.1.0&w=883&s=21828a78a2c3664cb3173c46a99e283c",
        })}
        description={text(
          "description",
          "What is Guide to Iceland? When was Guide to Iceland founded and why? How has Guide to Iceland changed since its conception? Continue reading to learn all about the leading travel agency of Iceland.  Find the widest range of tours on offer in Iceland \\tDiscover How to Travel in Iceland | The Top 5 Do’s and Don’ts \\tWatch these Amazing Videos of Iceland \\tBrowse these 10 Pictures of Iceland You Won’t Believe are Real Since its inception, Guide to Iceland has set out a simple mission: to provide the best services, tours and prices for travellers to Iceland seeking the holiday of a lifetime, while maintaining a strict ethics policy to protect the country’s nature and history"
        )}
        action={text("action", "Details")}
      />
    ),
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  )
  .add(
    "TeaserSideCardWithButton",
    () => (
      <TeaserSideCardWithButton
        {...object("widget", {
          id: "552",
          url:
            "http://oleksii-lukovka.traveldev.org/nature-info/iceland-in-january",
          variant: TeaserVariant.SIDE_CARD_WITH_BUTTON,
          title: "Iceland in January&nbsp;| Events, Tours and Nature&nbsp;",
          description:
            "What is it like to visit Iceland in January? Is it dark and cold? Where can you go, and what is there to do? Is it possible to see the northern lights? What kind of weather can you expect in January in Iceland? Continue reading for all there is to know about visiting Iceland in the depths of winter.   Explore the largest selection of Winter Self Drive Tours in Iceland  \tGet the most out of your travel experience by booking a Winter Package  \tSee Iceland's largest selection of Northern Lights Tours  \tRead about Iceland in February and Iceland in December  January is one of Iceland’s darkest and coldest months. The sun is only out for a few hours a day, the roads are icy, and the landscapes, more often than not, are covered in a metre of snow. Christmas festivities are quickly coming to a close, giving way to a lull in tourism, effectively making it one of Iceland´s quietest months.  Photo by Radka Valova  For those who dare to visit in a less conventional season, January delivers beautiful frosted landscapes, more hours of darkness to hunt for the northern lights, and fewer crowds at the places people want to see. Iceland in winter may not be the easiest place to negotiate, and harsh weather is common, but those with a little determination are sure to have an excellent winter holiday.  What to do in Iceland in January    Iceland is cold, snowy, and dark in January, but there's still a wealth of things to do. Multiple tours are still running, some of which are best in the depths of winter. As long as you make the most of the light hours, you won't find yourself short of exciting experiences.  Northern Lights in Iceland in January    Those coming to Iceland any time between September and April have a decent chance of seeing the Northern Lights. Those coming in January will have more opportunities than most to catch them, as there are only a few hours of sunlight . The sunrise and sunset times can be seen below.    \t\t\tSunrise Time \t\t\tSunset Time \t\t\tHours of Light \t\tJa...",
          action: "Read more",
          image: {
            id: "351611",
            name: "pictures-of-snaefellsnes-peninsula-2.jpg",
            url:
              "https://guidetoiceland.imgix.net/351611/x/0/pictures-of-snaefellsnes-peninsula-2-jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.1.0&s=8633dd74cdecb943d48ca983eb22fde4",
          },
        })}
        LinkComponent={ExternalLink}
      />
    ),
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  )
  .add("VerticalCard", () => (
    <TeasersContainer dashedArrow={false}>
      <TeaserSideCardHorizontal
        {...object("widget", BasicTeaserSideCardHorizontalMockData)}
        LinkComponent={ExternalLink}
      />
      <br />
      <TeaserSideCardHorizontal
        {...object("widget", BasicTeaserSideCardHorizontalMockData)}
        title="Iceland in January"
        LinkComponent={ExternalLink}
      />
    </TeasersContainer>
  ))
  .add("VerticalCard without CTA", () => (
    <TeasersContainer dashedArrow={false}>
      <TeaserSideCardHorizontal
        {...object("widget", BasicTeaserSideCardHorizontalMockData)}
        hasCallToAction={false}
        LinkComponent={ExternalLink}
      />
    </TeasersContainer>
  ))
  .add("VerticalCard with banner", () => (
    <TeasersContainer dashedArrow={false}>
      <TeaserSideCardHorizontal
        {...object("widget", BasicTeaserSideCardHorizontalMockData)}
        LinkComponent={ExternalLink}
        overlay={
          <TeaserOverlayBanner icon={TeaserOverlayBannerIconId.NEWEST} />
        }
      />
    </TeasersContainer>
  ))
  .add("ImageTitleOnly", () => (
    <TeaserImageTitleOnly
      {...object("widget", {
        id: "5520",
        url: "/",
        variant: TeaserVariant.IMAGE_TITLE_ONLY,
        title: "St. Peter's Basilica",
        subtitle: "6.9 km away",
        image: {
          id: "351611",
          name: "pictures-of-snaefellsnes-peninsula-2.jpg",
          url:
            "https://guidetoiceland.imgix.net/350109/x/0/the-south-coast-of-iceland-4-jpg?auto=format%2Ccompress&ch=Width%2CDPR&dpr=1&ixlib=react-8.6.4&s=5e8bc04e33410cc45f3bf15d59296da6&fit=crop&h=240&w=540",
        },
      })}
      LinkComponent={ExternalLink}
    />
  ))
  .add("TeaserImageWithAction", () => (
    <TeaserImageWithAction
      {...object("widget", {
        id: "5520",
        url: "/",
        variant: TeaserVariant.IMAGE_TITLE_ONLY,
        title: "Rome",
        subtitle: "Travel Guide",
        action: " Find out everything about Rome",
        image: {
          id: "351611",
          name: "pictures-of-snaefellsnes-peninsula-2.jpg",
          url:
            "https://guidetoiceland.imgix.net/350109/x/0/the-south-coast-of-iceland-4-jpg?auto=format%2Ccompress&ch=Width%2CDPR&dpr=1&ixlib=react-8.6.4&s=5e8bc04e33410cc45f3bf15d59296da6&fit=crop&h=240&w=540",
        },
      })}
      LinkComponent={ExternalLink}
    />
  ))
  .add("ImageTitleOnly group", () => (
    <TeasersContainer dashedArrow>
      <TeaserImageTitleOnly
        {...object("widget", {
          id: "5520",
          url: "/",
          variant: TeaserVariant.IMAGE_TITLE_ONLY,
          title: "St. Peter's Basilica",
          subtitle: "6.9 km away",
          image: {
            id: "351611",
            name: "pictures-of-snaefellsnes-peninsula-2.jpg",
            url:
              "https://guidetoiceland.imgix.net/350109/x/0/the-south-coast-of-iceland-4-jpg?auto=format%2Ccompress&ch=Width%2CDPR&dpr=1&ixlib=react-8.6.4&s=5e8bc04e33410cc45f3bf15d59296da6&fit=crop&h=240&w=540",
          },
        })}
        LinkComponent={ExternalLink}
      />
      <br />
      <TeaserImageTitleOnly
        {...object("widget", {
          id: "5520",
          url: "/",
          variant: TeaserVariant.IMAGE_TITLE_ONLY,
          title: "Trevi Fountain",
          subtitle: "3.6 km away",
          image: {
            id: "351611",
            name: "pictures-of-snaefellsnes-peninsula-2.jpg",
            url:
              "https://guidetoiceland.imgix.net/378821/x/0/puffins-6-jpg?auto=format%2Ccompress&ch=Width%2CDPR&dpr=1&ixlib=react-8.6.4&s=abbc7fcc86231116d613c000e0bf21d1&fit=crop&h=240&w=540",
          },
        })}
        LinkComponent={ExternalLink}
      />
    </TeasersContainer>
  ))
  .add("TeaserImageDistanceReview", () => (
    <TeaserImageDistanceReview
      {...object("widget", {
        id: "5520",
        url: "/",
        variant: TeaserVariant.IMAGE_TITLE_ONLY,
        title: "St. Basilica",
        subtitle: "6.9 km away",
        image: {
          id: "351611",
          name: "pictures-of-snaefellsnes-peninsula-2.jpg",
          url:
            "https://guidetoiceland.imgix.net/350109/x/0/the-south-coast-of-iceland-4-jpg?auto=format%2Ccompress&ch=Width%2CDPR&dpr=1&ixlib=react-8.6.4&s=5e8bc04e33410cc45f3bf15d59296da6&fit=crop&h=240&w=540",
        },
        reviewScore: 4.5,
        reviewsCount: 2100,
      })}
      LinkComponent={ExternalLink}
    />
  ))
  .add("TeaserCategoryBanner", () => (
    <TeaserCategoryBanner
      {...object("widget", {
        id: "5520",
        url: "/travel-iceland/drive",
        variant: TeaserVariant.CATEGORY_BANNER,
        title: "Best whale and puffin watching tours in Iceland",
        action: "Learn more",
        description: "Insider tip",
        ormName: CategoryBannerType.TOUR,
      })}
      LinkComponent={ExternalLink}
    />
  ));

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
import React, { useContext, useState } from "react";
import styled from "@emotion/styled";
// eslint-disable-next-line import/order
import { number, object, text, select, boolean } from "@storybook/addon-knobs";

import { MockedProvider } from "@apollo/react-testing";
import { storiesOf } from "@storybook/react";
import WithContainer from "@stories/decorators/WithContainer";

import QuickFacts from "../Information/QuickFacts";
import ProductSpecs from "../Information/ProductSpecs";
import PaginatedContent from "../PaginatedContent/PaginatedContent";
import CoverTemperatureWidget from "../Cover/CoverTemperatureWidget/CoverTemperatureWidget";
import ReadMoreTextModalContainer from "../ReadMoreTextModal/ReadMoreTextModalContainer";
import ReviewSummaryHorizontal from "../ReviewSummary/ReviewSummaryHorizontal";
import ProductPropositions from "../ProductPropositions";
import { ValuePropsWrapper } from "../FrontValuePropositions/FrontValuePropositionsShared";
import DomainSwitcher from "../../features/BestPlaces/DomainSwitcher";
import ExpiryTimer from "../ExpiryTimer";

import SearchPageStateContext from "components/features/SearchPage/SearchPageStateContext";
import Information from "components/ui/Information/Information";
import {
  mockParagraphText0,
  mockImages0,
  mockQueryProductSpecs0,
  mockImage0,
  mockImage1,
  mockImage2,
  mockImage3,
  mockDescription,
} from "utils/mockData/mockGlobalData";
import {
  TeaserVariant,
  IconSize,
  PageType,
  ProductCardType,
  BestPlacesPage,
} from "types/enums";
import Cover from "components/ui/Cover/Cover";
import ReviewStars from "components/ui/ReviewStars";
import CheckMark from "components/ui/CheckMark";
import SectionHeading from "components/ui/Section/SectionHeading";
import ExpandableText from "components/ui/ExpandableText/ExpandableText";
import SeeMoreCard from "components/ui/SimilarProducts/SeeMoreCard";
import DifficultyMediumIcon from "components/icons/difficulty-medium.svg";
import DurationIcon from "components/icons/duration.svg";
import LanguageIcon from "components/icons/language.svg";
import PickUpIcon from "components/icons/pick-up.svg";
import IconList from "components/ui/IconList/IconList";
import ContentTemplates from "components/ui/ContentTemplates/ContentTemplates";
import { Namespaces } from "shared/namespaces";
import ArticleWidgetTour from "components/ui/ArticleWidget/widgets/ArticleWidgetProduct";
import SubscriptionForm from "components/ui/SubscriptionsForm/SubscriptionForm";
import Ribbon from "components/ui/Ribbon/Ribbon";
import InformationOverflow from "components/ui/Information/InformationOverflow";
import ReviewSummary from "components/ui/ReviewSummary/ReviewSummary";
import ReviewSummaryWhite from "components/ui/ReviewSummary/ReviewSummaryWhite";
import ContentReviewSummary from "components/ui/ArticleLayout/ContentReviewSummary";
import SearchMobileFooter from "components/features/SearchPage/Search/SearchMobileFooter";
import Alert from "components/ui/Alert";
import Tooltip from "components/ui/Tooltip/Tooltip";
import FAQContainer from "components/ui/FAQ/FAQContainer";
import FAQItem from "components/ui/FAQ/FAQItem";
import ScrollSnapWrapper from "components/ui/ScrollSnapWrapper";
import TeaserImageTitleOnly from "components/ui/Teaser/variants/TeaserImageTitleOnly";
import SimpleTruncation from "components/ui/SimpleTruncation";
import HighlightedText from "components/ui/HighlightedText";

const heading = "Components";

storiesOf(`${heading}/ReviewSummary`, module)
  .add("dark background", () => (
    <div css={{ background: "rgba(0, 0, 0, 0.8);", padding: "15px" }}>
      <ReviewSummary
        reviewTotalScore={number("reviewTotalScore", 4.7)}
        reviewTotalCount={number("reviewTotalCount", 87)}
        isLink={boolean("isLink", true)}
      />
    </div>
  ))
  .add("white background", () => (
    <div css={{ background: "white", padding: "15px" }}>
      <ReviewSummaryWhite
        reviewTotalScore={number("reviewTotalScore", 4.7)}
        reviewTotalCount={number("reviewTotalCount", 87)}
        isLink={boolean("isLink", true)}
      />
    </div>
  ))
  .add("Horizontal", () => (
    <div css={{ background: "rgba(0, 0, 0, 0.8);", padding: "15px" }}>
      <ReviewSummaryHorizontal
        reviewTotalScore={number("reviewTotalScore", 4.7)}
        reviewTotalCount={number("reviewTotalCount", 87)}
      />
    </div>
  ))
  .add("Content page ReviewSummary", () => (
    <div css={{ padding: "15px" }}>
      <ContentReviewSummary
        reviewTotalScore={number("reviewTotalScore", 4.7)}
        reviewTotalCount={number("reviewTotalCount", 87)}
        reviewsCountText={text("87 Google reviews")}
      />
    </div>
  ));

storiesOf(`${heading}/ReviewStars`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ReviewStars reviewScore={number("reviewScore", 4.7)} />
  ));

storiesOf(`${heading}/SectionHeading`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <SectionHeading>
      {text("children", "This is a section header!")}
    </SectionHeading>
  ));

storiesOf(`${heading}/CheckMark`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <CheckMark
      color={select("Color", ["#336699", "#33ab63"], "#33ab63")}
      iconSize={select(
        "Size",
        [IconSize.Tiny, IconSize.Small, IconSize.Medium],
        IconSize.Medium
      )}
    />
  ));

storiesOf(`${heading}/ExpandableText`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ExpandableText
      id="storybook"
      text={text(
        "text",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
      )}
    />
  ));

storiesOf(`${heading}/Cover`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <MockedProvider>
      <Cover
        headerComponent={<h1>This is a heading</h1>}
        imageUrls={object("imageUrls", mockImages0)}
      />
    </MockedProvider>
  ))
  .add("Cover temperature widget", () => (
    <CoverTemperatureWidget
      location="Reykjavik"
      temperature={-21}
      weatherCondition="1"
    />
  ));

storiesOf(`${heading}/SeeMoreCard`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <SeeMoreCard
      seeMoreLink=""
      seeMoreText={text("seeMoreText", "See all tours")}
    />
  ));

storiesOf(`${heading}/Information`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <Information
      id="storybookInformation"
      information={object("information", mockDescription)}
      productSpecs={object("productSpecs", mockQueryProductSpecs0)}
    />
  ));

storiesOf(`${heading}/IconList`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <IconList
      sectionId="activityItems"
      iconList={object("iconList", [
        {
          id: "0",
          title: "Warm and waterproof clothes",
          Icon: DurationIcon,
          getIconColor: () => "black",
          iconStyles: {
            width: "16px",
            marginTop: "2px",
          },
        },
        {
          id: "1",
          title: "Swimsuit and towel",
          Icon: LanguageIcon,
          getIconColor: () => "black",
          iconStyles: {
            width: "16px",
            marginTop: "2px",
          },
        },
        {
          id: "2",
          title: "Driver’s licence",
          Icon: PickUpIcon,
          getIconColor: () => "black",
          iconStyles: {
            width: "16px",
            marginTop: "2px",
          },
        },
        {
          id: "3",
          title: "Warm and waterproof clothes",
          Icon: DurationIcon,
          getIconColor: () => "black",
          iconStyles: {
            width: "16px",
            marginTop: "2px",
          },
        },
        {
          id: "4",
          title: "Swimsuit and towel",
          Icon: LanguageIcon,
          getIconColor: () => "black",
          iconStyles: {
            width: "16px",
            marginTop: "2px",
          },
        },
        {
          id: "5",
          title: "Driver’s licence",
          Icon: PickUpIcon,
          getIconColor: () => "black",
          iconStyles: {
            width: "16px",
            marginTop: "2px",
          },
        },
      ])}
      iconLimit={number("iconLimit", 6)}
    />
  ));

storiesOf(`${heading}/ArticleWidgetTour`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ArticleWidgetTour
      productType={ProductCardType.TOUR}
      list={object("list", [
        {
          id: "772",
          name: "4 Day Summer Self Drive Tour | The Golden Circle & Vik",
          lowestPrice: 343.174832,
          priceDescription: "Price for 1 adult",
          image: {
            id: "496999",
            url:
              "https://guidetoiceland.imgix.net/496999/x/0/skogafoss-waterfall-is-one-of-two-famous-south-iceland-waterfalls-the-other-being-seljalandsfoss.jpg",
            name:
              "Skógafoss waterfall is one of two famous south Iceland waterfalls, the other being Seljalandsfoss.",
          },
          review: {
            totalScore: 5,
            totalCount: 6,
          },
          duration: "4 days",
          linkUrl:
            "https://guidetoiceland.is/book-holiday-trips/4-day-self-drive-tour-golden-circle-and-vik",
          currency: "USD",
        },
        {
          id: "4904",
          name:
            "10 Day Summer Self-Drive in Iceland | Explore the Best Ring Road Attractions in Depth",
          lowestPrice: 732.0112799999999,
          priceDescription: "Price for 1 adult",
          image: {
            id: "384874",
            url:
              "https://guidetoiceland.imgix.net/384874/x/0/the-cliffs-surrounding-skogafoss-waterfall-on-the-south-coast-are-verdant-with-plant-life-and-teaming-with-birds",
            name:
              "The cliffs surrounding Skógafoss waterfall on the South Coast are verdant with plant-life and teaming with birds.",
          },
          review: {
            totalScore: 5,
            totalCount: 3,
          },
          duration: "10 days",
          linkUrl:
            "https://guidetoiceland.is/book-holiday-trips/10-day-summer-self-drive-ring-road-circle-in-depth",
          currency: "USD",
        },
        {
          id: "697",
          name: "Summer 7 Day Self Drive Tour | North Iceland & Myvatn",
          lowestPrice: 1261.8926319999998,
          priceDescription: "Price for 1 adult",
          image: {
            id: "497040",
            url:
              "https://guidetoiceland.imgix.net/497040/x/0/myvatn-is-a-lake-area-in-north-iceland-renowned-for-its-geology-and-birds.jpg",
            name:
              "Mývatn is a lake area in north Iceland, renowned for its geology and birds.",
          },
          review: {
            totalScore: 5,
            totalCount: 3,
          },
          duration: "7 days",
          linkUrl:
            "https://guidetoiceland.is/book-holiday-trips/7-day-self-drive-tour-lake-myvatn-and-the-north",
          currency: "USD",
        },
      ] as ArticleWidgetTypes.ArticleWidgetTourItem[])}
    />
  ));

storiesOf(`${heading}/ContentTemplates`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ContentTemplates
      columns={{ medium: 2 }}
      items={
        [
          {
            id: "1",
            name: text("name", "Some cool header"),
            images: [
              {
                id: "1",
                url:
                  "https://guidetoiceland.imgix.net/450701/x/0/what-to-do-amp-where-to-go-1.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.1.0&w=883&s=21828a78a2c3664cb3173c46a99e283c",
                name: "Lupine field",
              },
              {
                id: "2",
                url:
                  "https://guidetoiceland.imgix.net/408965/x/0/what-to-do-amp-where-to-go-3?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.1.0&w=883&s=d8e35b73dffa8018d2f6cc1ab9d86cf1",
                name: "Seashore",
              },
            ],
            information: [
              {
                Icon: PickUpIcon,
                name: "fact 1 label",
                value: "fact 1 value",
              },
              {
                Icon: PickUpIcon,
                name: "fact 2 label",
                value: "fact 2 value",
              },
            ] as SharedTypes.ProductSpec[],
          },
        ] as AccommodationTypes.Room[]
      }
    />
  ));

storiesOf(`${heading}/SubscriptionForm`, module)
  .addDecorator(WithContainer)
  .add("default", () => <SubscriptionForm />);

const RibbonWrapper = styled.div`
  position: absolute;
  top: 27px;
  left: -79px;
  display: block;
  width: 300px;
  transform: rotate(-30deg);
`;

storiesOf(`${heading}/Ribbon`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <RibbonWrapper>
      <Ribbon
        ribbonText={text("ribbonText", "Awesome tour")}
        ribbonType={select(
          "ribbonType",
          ["fullyBooked", "discount", "custom"],
          "custom"
        )}
      />
    </RibbonWrapper>
  ));

storiesOf(`${heading}/InformationOverflow`, module).add("default", () => (
  <InformationOverflow id="story">
    <div // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html:
          '<p dir="ltr" style="text-align:center;">We always try to help travellers fulfil their dream vacation. If you need to change the details of your trip, you can do so by pressing the &lsquo;<em>Click here to edit booking</em>&rsquo; button that will be on your electronic voucher. This electronic voucher will arrive to you via email upon booking.</p>\n\n<p dir="ltr" style="text-align:center;">Please bear in mind that Iceland currently receives sixfold its population yearly as visitors, so tourism services are in high demand. The earlier you reserve your trip the better availability you can find and the better rates you can get. Please find a summary of our cancellation policy and terms of service below. For further information, please see <a href="https://guidetoiceland.is/pages/terms-and-conditions">our Terms and Conditions.</a></p>\n\n<p>&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>Cancellations of Day Tours, Combo Deals and Multi-Day</strong><strong> tours from independent operators</strong></p>\n\n<p dir="ltr" style="text-align:justify;">Day Tours and Combo Deals which only include day tours booked on the Guide to Iceland webpage that are serviced by independent operators can be cancelled up to 24 hours before departure for a full refund. This can be done via the &lsquo;Edit Booking&rsquo; button in your electronic voucher email.</p>\n\n<p dir="ltr" style="text-align:justify;">All tours, regardless of operator, which last for two days or more (Multi-Day tours and Combos including Multi-Day tours) can be cancelled up to 7 days before departure date notice for an 85% refund. The 15% service fee is to cover operator cost of planning and arrangement. Please note that changing the number of people in a booking to a smaller number is considered cancellation for the change in the number of pax. No refund is given if tours are cancelled within 7 days notice.</p>\n\n<p dir="ltr" style="text-align:justify;">In case of partial cancellations, e.g. an activity portion of a multi-day tour is cancelled by the operator, or a tour layout is changed due to weather conditions or other unforeseen circumstances, a partial refund is due. If an activity is changed, the price difference between activities will be refunded, or a percentage stated by tour&nbsp;operator as the standard refund due to changes in program of the tour.</p>\n\n<p>&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>Cancellations of car rentals</strong></p>\n\n<p dir="ltr" style="text-align:justify;">Car rentals reservations can be cancelled up to 24 hours before departure and receive a full refund. This can be done via the &lsquo;Edit Booking&rsquo; button in your electronic voucher email.</p>\n\n<p style="text-align:justify;">&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>Cancellations of accommodation</strong></p>\n\n<p dir="ltr" style="text-align:justify;">The details of available refunds are dealt with on an individual basis depending on the accommodation provider. To cancel accommodation, select the &lsquo;Click here to edit booking&rsquo; button in your electronic voucher email. Please note that if your accommodation booking is a part of an All-In-One Self Drive or Holiday package serviced by Guide to Iceland, you will not be able to cancel it via the button in the electronic voucher, you will need to contact us via <a href="mailto:mailto:info@guidetoiceland.is">info@guidetoiceland.is</a> with the relevant information.</p>\n\n<p style="text-align:justify;">&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>Cancellations of flights</strong></p>\n\n<p dir="ltr" style="text-align:justify;">Scheduled international and domestic flights are non-refundable, be they a part of an All-In-One Self Drive or Holiday package, multi-day tour, or any other service purchasable on the Guide to Iceland website, unless the Cancellation insurance is purchased. If a cancellation insurance is purchased, a full refund is given.</p>\n\n<p dir="ltr" style="text-align:justify;">If flights are a part of a tour listed as a Day-Tour, standard terms of cancellations of day tours apply to a full refund. For cancelling and refunding of private flights (flights specifically arranged and scheduled for you personally or your group in specific), please contact your service agent.</p>\n\n<p style="text-align:justify;">&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>Cancellations due to weather conditions</strong></p>\n\n<p dir="ltr" style="text-align:justify;">If your tour is cancelled by the tour provider due to weather conditions or any other environmental circumstances you will always receive a full refund. Exempt from this are any rescheduled second tries of tours which already have been serviced as a first departure. In the case of a volcanic eruption taking place on Icelandic soil stopping you from getting to Iceland, you will also receive a full refund on All products booked on Guide to Iceland.</p>\n\n<p style="text-align:justify;">&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>Cancellation of All-In-One Self Drives and Holiday Packages arranged by Guide to Iceland</strong></p>\n\n<p dir="ltr" style="text-align:justify;">You can cancel your All-In-One Self Drive or Holiday package arranged by Guide to Iceland up to 7 days before departure and receive an 85% refund. The 15% service fee is to cover our cost of planning and arrangement. No refund is issued if there are less than 7 days to the starting date of the All-In-One Self Drive or Holiday package.</p>\n\n<p dir="ltr" style="text-align:justify;">If a cancellation is made less than 24 hours after booking, Guide to Iceland will refund the tour fully, unless non-refundable separate booking has been made for said All-In-One Self Drive or Holiday package. In such cases, an amount to cover said object will be held, while the remaining amount will be refunded.</p>\n\n<p dir="ltr" style="text-align:justify;">It is not possible to cancel or alter any individual services within a package within 7 days of Self Drive or package starting date. Please note that this includes reducing the number of participants within a self-drive or a package.</p>\n\n<p dir="ltr" style="text-align:justify;">In cases where an All-In-One Self Drive or a Holiday Package is disrupted due to official road closure or Act of God, Guide to Iceland will reroute and or rearrange to the best of their abilities and assist with cancellations, making partial refunds when applicable and full refunds when applicable.</p>\n\n<p dir="ltr" style="text-align:justify;">Clients who have purchased a Cancellation Insurance to accompany their Self Drive or Holiday package can request a full refund up to 48 hours before arrival.&nbsp;Please note that a Cancellation Insurance can only be purchased upon the time of booking or added to a product within 24 hours of booking. Please see <a href="https://guidetoiceland.is/pages/terms-and-conditions">Terms and Conditions</a> for further information.</p>\n\n<p style="text-align:justify;">&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>How to cancel or change a booking</strong></p>\n\n<p dir="ltr" style="text-align:justify;">All cancellations and changes must be made through the voucher that you receive on your email after booking. It will have an edit booking button that allows you to modify and cancel your bookings. After clicking the button you will be taken to a modification page where you can amend your booking details. There will be buttons available both to confirm changes and to cancel your booking. If you can not cancel or modify your booking then the time to do so has expired.</p>\n\n<p dir="ltr" style="text-align:justify;">Refunds of past services need to be submitted within 15 days after the completion of the tour/package services. All refund requests must be made through email to <em>booking@guidetoiceland.is</em> with the email subject as: <em>Refund Request - [Order number]</em>. We do not charge anything for helping you change or make simple rearrangements to your booking for day tours, multi-day tours serviced by independent operators, and car rentals as long as they are requested within the window allowed for changes to a product, but costs can change accordingly with your new details. Please be advised that though we always try our best, due to high demand and low availability, rearrangements are not always possible.</p>\n\n<p dir="ltr" style="text-align:justify;">For All-In-One Self-drives and Holiday Packages arranged by Guide to Iceland, please contact your travel planner for any changes needed. We do not charge anything for helping you change or make simple rearrangements to your All-In-One Self drive or Holiday Package, but please note that costs can change accordingly, depending on hotel rates, car rentals, change of included products etc. In that case, we will either notify you about the increased costs or refund you the difference. In cases where changes reach a form that require rebookings and tailoring of travel, a service fee of 15% of total tour price might apply. &nbsp;Please see full <a href="https://guidetoiceland.is/pages/terms-and-conditions">Terms and Conditions</a> for further details.</p>\n\n<p dir="ltr" style="text-align:justify;">Please note that changing the number of people in a booking to a smaller number is considered cancellation for the change in the number of pax.</p>\n\n<p style="text-align:justify;">&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>Terms for accommodation in All-In-One Holiday packages and Self-Drives booked with Guide to Iceland</strong></p>\n\n<p dir="ltr" style="text-align:justify;">If you are booking an All-In-One Holiday Package or Self-Drive with Guide to Iceland, accommodation will be arranged as follows:</p>\n\n<p dir="ltr" style="margin-left:40px;text-align:justify;">Super Budget level accommodation is set in dormitories or rooms with shared facilities, regardless of the number of participants. Budget level accommodation and Comfort level accommodation will be arranged as follows: A single traveller will receive a single bedroom. Even number groups will be set at twin/double rooms, and odd numbers at extended twin/double or a triple.</p>\n\n<p dir="ltr" style="margin-left:40px;text-align:justify;">All bookings at Quality level will be set as a single room for one traveller and two travellers or even numbered groups in double/twin rooms. Odd number groups will always be allocated a single room for the single traveller. If more than one individual of the group requires a single room, additional charges may apply. Different arrangements can be made, but please note that fees might apply.</p>\n\n<p dir="ltr" style="margin-left:40px;text-align:justify;">Accommodation for children and teens is arranged so that they lodge with their guardians, either in a baby cot or an additional bed in the room. Should the number of children/teens exceed the number of adults travelling with them, the exceeding number of children/teens are subject to full adult prices.</p>\n\n<p style="text-align:justify;">&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>Pickups</strong></p>\n\n<p dir="ltr" style="text-align:justify;">During the booking process&nbsp;you will be able to choose a pickup location and starting time. If you do not show up for the scheduled pickup time and location stated on your booking, your reservation is non-refundable.</p>\n\n<p dir="ltr" style="text-align:justify;">If you do not know your pickup location at the time of booking, you can choose to update your pickup location later, up to 24 hours before tour departure. Click on the link in your voucher email to update your pickup location and other details. Please call the number listed on your voucher if you do not receive a confirmation of your pickup location update.</p>\n\n<p style="text-align:justify;"><br>\n&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>Terms of payment</strong></p>\n\n<p dir="ltr" style="text-align:justify;">When you reserve online a full payment is charged to your credit card. To reserve for group bookings and packages of more than 15 people, you can also contact us by email and make a 15% down payment. We will then start reserving your trip to secure you the best price. The rest of your payment must reach us 30 days before your arrival. Please contact <em>info@guidetoiceland.is</em> for this service.</p>\n\n<p dir="ltr" style="text-align:justify;">All charges are made in Icelandic krona. On our website you can view an estimate of prices in a number of currencies. This is only to help you understand the approximate price in your preferred currency. Final payment is always conducted in ISK. We also refund in ISK. As Guide to Iceland does not charge any booking or transaction fees we can not be held liable to any loss in currency exchange during transactions, nor any third party transaction fees that may occur at the time of payment and/or refund.</p>\n\n<p style="text-align:justify;">&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>Car rental terms</strong></p>\n\n<p dir="ltr" style="text-align:justify;">All drivers must be a minimum of 20 years of age and have had a driver&rsquo;s license for at least 1 year. For certain vehicles, the minimum age might be 23 or higher. It is the responsibility of the client to understand and honour the driver minimum age. Please note that rentals are not obliged to honour a rental should the driver not meet the age requirements. Upon receiving the rental vehicle, a valid driver\'s license in the Latin alphabet and a credit card must be presented. You will be asked to sign a contract with the car rental. We advise you read this contract carefully and make sure that you are aware of the different insurances that you choose; what you are insured for, self-risk and more. Please note that security deposit from a valid credit card of attending traveller might be required upon pick up. The amount may vary depending on car rental and car model. Please contact the rental agency directly for further information. Upon return of the car, the deposit will be returned to you, provided the conditions of the car is the same as when picked-up. Please note that the car rental agreement will be between the renter and the car rental agency, and any disputes regarding damages etc. will need to be resolved between the two parties. Guide to Iceland cannot be liable for what you have agreed upon with the car rental company.</p>\n\n<p dir="ltr" style="text-align:justify;">Guide to Iceland cannot be liable to any loss, damages, injuries, accidents, death or sickness during your stay in Iceland. All matters related to damages to the car are dealt with directly with the car rental. If you have any complaints about one of our car rental partners please send us an email to <em>info@guidetoiceland.is</em> and we will help you protect your rights.</p>\n\n<p style="text-align:justify;">&nbsp;</p>\n\n<p dir="ltr" style="text-align:center;"><strong>General terms</strong></p>\n\n<p dir="ltr" style="text-align:justify;">Guide to Iceland cannot be liable to any loss, damage, accidents, injuries, death or sickness during your tour. The same applies for any changes in tour schedule due to weather, strikes or any other force majeure. Tour operators reserve the right to change routes, schedules and itineraries if needed because of weather, road conditions or should the necessity arise because of unforeseen reasons or circumstances.</p>\n\n<p dir="ltr" style="text-align:justify;">We advise all travellers to purchase a comprehensive travel insurance to minimize possible losses due to unforeseeable situations during your travel. Guide to Iceland does not offer any travel insurance, so please contact your preferred private travel insurance company.</p>\n\n<p dir="ltr" style="text-align:justify;">If you have a complaint about any of our partners please contact us at <em>info@guidetoiceland.is</em> and we will protect your rights.</p>\n\n<p style="text-align:justify;">&nbsp;</p>\n',
      }}
    />
  </InformationOverflow>
));

storiesOf(`${heading}/Alert`, module).add("default", () => (
  <Alert>{text("children", "Any arbitrary content!")}</Alert>
));

storiesOf(`${heading}/QuickFacts`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <>
      <br />
      <QuickFacts
        fullWidth={boolean("fullWidth", false)}
        namespace={Namespaces.accommodationNs}
        quickFacts={object("quickFacts", [
          {
            id: "0",
            label: "Duration",
            value: "5 days, 7 days, 10 days, 11 days",
            Icon: DurationIcon,
          },
          {
            id: "1",
            label: "Difficulty",
            value: "Medium",
            Icon: DifficultyMediumIcon,
          },
          {
            id: "2",
            label: "Language",
            value: "English",
            Icon: LanguageIcon,
          },
          {
            id: "3",
            label: "Free pickup",
            value: "Keflavík Airport, Reykjavík, Some long string to truncate",
            Icon: PickUpIcon,
          },
        ])}
      />
    </>
  ));

const productSpecs = [
  {
    name: "Duration",
    value: "5 days, 7 days, 10 days, 11 days",
    Icon: DurationIcon,
  },
  {
    name: "Difficulty",
    value: "Medium",
    Icon: DifficultyMediumIcon,
  },
  {
    name: "Language",
    value: "English",
    Icon: LanguageIcon,
  },
  {
    name: "Free pickup",
    value: "Keflavík Airport, Reykjavík, Some long string to truncate",
    Icon: PickUpIcon,
  },
];

storiesOf(`${heading}/ProductSpecs`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <>
      <br />
      <ProductSpecs
        id="productSpecs"
        fullWidth={boolean("fullWidth", false)}
        productSpecs={object("productSpecs", productSpecs)}
      />
    </>
  ))
  .add("with expanded funtionality when we have more than 8 specs", () => (
    <>
      <br />
      <ProductSpecs
        id="productSpecs"
        fullWidth={boolean("fullWidth", true)}
        productSpecs={object("productSpecs", [
          ...productSpecs,
          ...productSpecs,
          ...productSpecs,
        ])}
      />
    </>
  ));

storiesOf(`${heading}/Tooltip`, module).add("default", () => (
  <>
    <br />
    <br />
    <Tooltip title={text("title", "title")}>
      {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
      <div>🎲 hover me 🎲</div>
    </Tooltip>
  </>
));

storiesOf(`${heading}/SearchMobileFooter`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    const { setContextState } = useContext(SearchPageStateContext);
    return (
      <SearchMobileFooter
        onFilterButtonClick={() => {}}
        setContextState={setContextState}
      />
    );
  });

storiesOf(`${heading}/FAQContainer`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <FAQContainer
      questions={[
        {
          id: 1,
          question: "What is a nature tour?",
          answer:
            "Nature tours are multi-day excursions across Iceland where you follow a pre-arranged travel itinerary based on your own choices of attractions and activities. Self drive tours provide an unequalled level of autonomy as you set your own pace and embark on the holiday of your choosing, adding as many tours and activities as you see fit. One of the great benefits of a self drive tour is 24/7 contact with a personal travel advisor, ensuring a level of expertise and security throughout your journey.",
        },
        {
          id: 2,
          question: "What is a nature tour?",
          answer:
            "Nature tours are multi-day excursions across Iceland where you follow a pre-arranged travel itinerary based on your own choices of attractions and activities. Self drive tours provide an unequalled level of autonomy as you set your own pace and embark on the holiday of your choosing, adding as many tours and activities as you see fit. One of the great benefits of a self drive tour is 24/7 contact with a personal travel advisor, ensuring a level of expertise and security throughout your journey.",
        },
        {
          id: 3,
          question: "What is a nature tour?",
          answer:
            "Nature tours are multi-day excursions across Iceland where you follow a pre-arranged travel itinerary based on your own choices of attractions and activities. Self drive tours provide an unequalled level of autonomy as you set your own pace and embark on the holiday of your choosing, adding as many tours and activities as you see fit. One of the great benefits of a self drive tour is 24/7 contact with a personal travel advisor, ensuring a level of expertise and security throughout your journey.",
        },
      ]}
    />
  ))
  .add("FAQItem", () => (
    <FAQItem
      id={1}
      title="What is a nature tour?"
      description="Nature tours are multi-day excursions across Iceland where you follow a pre-arranged travel itinerary based on your own choices of attractions and activities. Self drive tours provide an unequalled level of autonomy as you set your own pace and embark on the holiday of your choosing, adding as many tours and activities as you see fit. One of the great benefits of a self drive tour is 24/7 contact with a personal travel advisor, ensuring a level of expertise and security throughout your journey."
    />
  ));

storiesOf(`${heading}/PaginatedContent`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    const [mockState, setMockState] = useState("initial content");
    const getMockData = (pageNumber: number) =>
      `Some content for page ${pageNumber}`;

    const pageChangehandler = async ({
      current,
    }: {
      current: number;
      previous?: number;
    }) => {
      setMockState("loading...");
      setTimeout(() => setMockState(getMockData(current)), 500);
    };

    return (
      <PaginatedContent
        name="storybook-pages"
        isLoading={mockState === "loading..."}
        initialPage={number("initialPage", 5)}
        totalPages={number("totalPages", 50)}
        pagesToShow={number("pagesToShow", 3)}
        onPageChange={pageChangehandler}
      >
        <>
          <br />
          <br />
          {mockState}
        </>
      </PaginatedContent>
    );
  });

storiesOf(`${heading}/ReadMoreTextModal`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ReadMoreTextModalContainer
      id="awesome-id"
      mobileCharLimit={number("mobileCharLimit", 100)}
      desktopCharLimit={number("desktopCharLimit")}
      title={text("Title", "Awesome title")}
      text={text("Text", "Lorem ipsum".repeat(100))}
    />
  ));

storiesOf(`${heading}/ScrollSnapWrapper`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    const mockServices0 = [
      {
        id: "1",
        title: "Get a complete travel plan",
        slug: "holidays-vacation-packages",
        url: "/book-trips-holidays/holidays-vacation-packages",
        route: `/${PageType.TOURCATEGORY}`,
        image: mockImage0,
      },
      {
        id: "2",
        title: "Book your tours",
        route: `/${PageType.TOURSEARCH}`,
        url: "/book-trips-holidays",
        image: mockImage1,
      },
      {
        id: "3",
        title: "Find a hotel",
        route: `/${PageType.ACCOMMODATION}`,
        url: "/accommodation",
        image: mockImage2,
      },
      {
        id: "4",
        title: "Rent a car",
        route: `/${PageType.CARSEARCH}`,
        image: mockImage3,
        url: "/choose-your-car-in-iceland",
      },
    ];

    return (
      <ScrollSnapWrapper>
        {mockServices0.map(service => (
          <TeaserImageTitleOnly
            variant={TeaserVariant.IMAGE_TITLE_ONLY}
            url=""
            image={service.image}
            title={service.title}
            smallTitle
          />
        ))}
      </ScrollSnapWrapper>
    );
  });

storiesOf(`${heading}/FrontValuePropositions`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    const mockProductProps = [
      { Icon: DurationIcon, title: "Largest Selection of Travel Services" },
      { Icon: LanguageIcon, title: "Best price guarantee" },
      { Icon: PickUpIcon, title: "Easy Booking & Cancellation" },
    ];

    return (
      <ValuePropsWrapper>
        <ProductPropositions
          productProps={mockProductProps}
          maxDesktopColumns={3}
          useTruncationIcon={boolean("useTruncationIcon", false)}
        />
      </ValuePropsWrapper>
    );
  });

storiesOf(`${heading}/SimpleTruncation`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    const mockHTML = `<div>${mockParagraphText0}</div>`.repeat(10);

    return (
      <SimpleTruncation
        content={mockHTML}
        numberOfLines={8}
        id="storybookTruncation"
      />
    );
  });

storiesOf(`${heading}/DomainSwitcher`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    const pageTypes = [
      PageType.BEST_PLACES,
      PageType.TOURSEARCH,
      PageType.ACCOMMODATION_SEARCH,
      PageType.CARSEARCH,
    ];

    return (
      <DomainSwitcher
        pageTypes={pageTypes}
        activeItemId={BestPlacesPage.DESTINATIONS}
      />
    );
  });

const HighlightedTextWrapper = styled.div`
  width: 150px;
`;

storiesOf(`${heading}/HighlightedText`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    return (
      <HighlightedTextWrapper>
        <HighlightedText>{text("Text", "HighlightedText")}</HighlightedText>
      </HighlightedTextWrapper>
    );
  });

storiesOf(`${heading}/ExpiryTimer`, module)
  .addDecorator(WithContainer)
  .add("default", () => {
    return (
      <ExpiryTimer
        numberOfSecondsUntilExpiry={number("numberOfSecondsUntilExpiry", 3600)}
      />
    );
  });

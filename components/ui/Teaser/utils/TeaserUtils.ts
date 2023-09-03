import { TeaserOverlayBannerIconId } from "types/enums";
import AlarmBellRing1 from "components/icons/alarm-bell-ring-1.svg";
import LoveIt from "components/icons/love-it.svg";
import MatchesFire from "components/icons/matches-fire.svg";
import AwardStarHead from "components/icons/award-star-head.svg";
import { blueColor, greenColor, buttercupColor, redCinnabarColor } from "styles/variables";

export const getTeaserOverlayBannerPropsById = (iconId?: string) => {
  switch (iconId) {
    case TeaserOverlayBannerIconId.TRENDING:
      return {
        title: "Trending now",
        bgColor: redCinnabarColor,
        Icon: MatchesFire,
      };
    case TeaserOverlayBannerIconId.NEWEST:
      return {
        title: "Newest article",
        bgColor: greenColor,
        Icon: AlarmBellRing1,
      };
    case TeaserOverlayBannerIconId.POPULAR:
      return {
        title: "All time popular",
        bgColor: buttercupColor,
        Icon: LoveIt,
      };
    case TeaserOverlayBannerIconId.RECOMMENDED:
      return {
        title: "Most recommended",
        bgColor: blueColor,
        Icon: AwardStarHead,
      };
    default:
      return {};
  }
};

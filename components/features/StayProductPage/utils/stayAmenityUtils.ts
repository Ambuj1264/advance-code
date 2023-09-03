import { RoomAmenity } from "../StayBookingWidget/types/enums";

import CustomNextDynamic from "lib/CustomNextDynamic";
import IconLoading from "components/ui/utils/IconLoading";

const WashingMashineIcon = CustomNextDynamic(() => import("components/icons/waching-machine.svg"), {
  loading: IconLoading,
});
const CoffeeIcon = CustomNextDynamic(() => import("components/icons/coffe-mashine.svg"), {
  loading: IconLoading,
});
const TowelIcon = CustomNextDynamic(() => import("components/icons/spa-towel.svg"), {
  loading: IconLoading,
});
const MiniBarIcon = CustomNextDynamic(() => import("components/icons/vending-machine.svg"), {
  loading: IconLoading,
});
const HairDryerIcon = CustomNextDynamic(() => import("components/icons/hair-dryer.svg"), {
  loading: IconLoading,
});
const ToiletriesIcon = CustomNextDynamic(() => import("components/icons/spa-soap.svg"), {
  loading: IconLoading,
});
const TVIcon = CustomNextDynamic(() => import("components/icons/tv.svg"), {
  loading: IconLoading,
});
const HeaterIcon = CustomNextDynamic(() => import("components/icons/heater.svg"), {
  loading: IconLoading,
});
const AirConditionIcon = CustomNextDynamic(() => import("components/icons/ac.svg"), {
  loading: IconLoading,
});
const KitchenIcon = CustomNextDynamic(() => import("components/icons/stove.svg"), {
  loading: IconLoading,
});
const PetIcon = CustomNextDynamic(() => import("components/icons/cat-sitting.svg"), {
  loading: IconLoading,
});
const DefaultIcon = CustomNextDynamic(() => import("components/icons/information-circle1.svg"), {
  loading: IconLoading,
});
const PhoneIcon = CustomNextDynamic(() => import("components/icons/phone-simple.svg"), {
  loading: IconLoading,
});
const OvenIcon = CustomNextDynamic(() => import("components/icons/oven.svg"), {
  loading: IconLoading,
});
const ToasterIcon = CustomNextDynamic(() => import("components/icons/toaster.svg"), {
  loading: IconLoading,
});
const DishWasherIcon = CustomNextDynamic(() => import("components/icons/dish-washer.svg"), {
  loading: IconLoading,
});
const BathroomIcon = CustomNextDynamic(() => import("components/icons/bathroom-shower.svg"), {
  loading: IconLoading,
});
const NoSmokingIcon = CustomNextDynamic(
  () => import("components/icons/allowances-no-smoking.svg"),
  {
    loading: IconLoading,
  }
);
const SeaViewIcon = CustomNextDynamic(() => import("components/icons/outdoors-water-birds.svg"), {
  loading: IconLoading,
});
const GardenViewIcon = CustomNextDynamic(() => import("components/icons/outdoors-sun-plants.svg"), {
  loading: IconLoading,
});
const MountainIcon = CustomNextDynamic(() => import("components/icons/landmark-mountain.svg"), {
  loading: IconLoading,
});
const CityIcon = CustomNextDynamic(() => import("components/icons/building-cloudy.svg"), {
  loading: IconLoading,
});
const PoolIcon = CustomNextDynamic(() => import("components/icons/swimming-pool-stairs.svg"), {
  loading: IconLoading,
});
const DeskIcon = CustomNextDynamic(() => import("components/icons/office-desk-lamp.svg"), {
  loading: IconLoading,
});
const ToiletIcon = CustomNextDynamic(() => import("components/icons/toilet-seat-1.svg"), {
  loading: IconLoading,
});
const RobeIcon = CustomNextDynamic(() => import("components/icons/bathroom-robe.svg"), {
  loading: IconLoading,
});
const SlippersIcon = CustomNextDynamic(() => import("components/icons/footwear-slippers.svg"), {
  loading: IconLoading,
});
const SofaIcon = CustomNextDynamic(() => import("components/icons/sofa-double.svg"), {
  loading: IconLoading,
});
const ArmchairIcon = CustomNextDynamic(() => import("components/icons/armchair-1.svg"), {
  loading: IconLoading,
});
const ChairIcon = CustomNextDynamic(() => import("components/icons/chair.svg"), {
  loading: IconLoading,
});
const FanIcon = CustomNextDynamic(() => import("components/icons/ventilator.svg"), {
  loading: IconLoading,
});
const FridgeIcon = CustomNextDynamic(() => import("components/icons/appliances-fridge.svg"), {
  loading: IconLoading,
});
const SoundProofIcon = CustomNextDynamic(
  () => import("components/icons/volume-control-off-2.svg"),
  {
    loading: IconLoading,
  }
);
const SafeIcon = CustomNextDynamic(() => import("components/icons/saving-safe-1.svg"), {
  loading: IconLoading,
});

export const getRoomAmenity = (roomAmenity: RoomAmenity, t: TFunction): SharedTypes.Icon[] => {
  switch (roomAmenity) {
    case RoomAmenity.AIR_CONDITIONING:
      return [
        {
          id: roomAmenity,
          Icon: AirConditionIcon,
          title: t("Air conditioning"),
        },
      ];
    case RoomAmenity.MINI_BAR:
      return [
        {
          id: roomAmenity,
          Icon: MiniBarIcon,
          title: t("Mini bar"),
        },
      ];
    case RoomAmenity.TV:
      return [
        {
          id: roomAmenity,
          Icon: TVIcon,
          title: t("TV"),
        },
      ];
    case RoomAmenity.HAIR_DRYER:
      return [
        {
          id: roomAmenity,
          Icon: HairDryerIcon,
          title: t("Hair dryer"),
        },
      ];
    case RoomAmenity.SAFE_DEPOSIT_BOX:
    case RoomAmenity.LAPTOP_SAFE_BOX:
      return [
        {
          id: roomAmenity,
          Icon: SafeIcon,
          title: t("Safe deposit box"),
        },
      ];
    case RoomAmenity.REFRIGERATOR:
      return [
        {
          id: roomAmenity,
          Icon: FridgeIcon,
          title: t("Refrigerator"),
        },
      ];
    case RoomAmenity.TOWELS:
      return [
        {
          id: roomAmenity,
          Icon: TowelIcon,
          title: t("Towels"),
        },
      ];
    case RoomAmenity.PRIVATE_KITCHEN:
    case RoomAmenity.KITCHEN:
    case RoomAmenity.KITCHENETTE:
    case RoomAmenity.KITCHENWARE:
      return [
        {
          id: roomAmenity,
          Icon: KitchenIcon,
          title: t("Kitchen"),
        },
      ];
    case RoomAmenity.FREE_TOILETRIES:
      return [
        {
          id: roomAmenity,
          Icon: ToiletriesIcon,
          title: t("Free toiletries"),
        },
      ];
    case RoomAmenity.PETS_ALLOWED:
      return [
        {
          id: roomAmenity,
          Icon: PetIcon,
          title: t("Pets allowed"),
        },
      ];
    case RoomAmenity.SOUNDPROOFING:
      return [
        {
          id: roomAmenity,
          Icon: SoundProofIcon,
          title: t("Sound proof"),
        },
      ];
    case RoomAmenity.FAN:
      return [
        {
          id: roomAmenity,
          Icon: FanIcon,
          title: t("Fan"),
        },
      ];
    case RoomAmenity.HEATING:
      return [
        {
          id: roomAmenity,
          Icon: HeaterIcon,
          title: t("Heating"),
        },
      ];
    case RoomAmenity.BALCONY:
      return [
        {
          id: roomAmenity,
          Icon: DefaultIcon,
          title: t("Balcony"),
        },
      ];
    case RoomAmenity.SUN_TERRACE:
    case RoomAmenity.TERRACE:
      return [
        {
          id: roomAmenity,
          Icon: GardenViewIcon,
          title: t("Terrace"),
        },
      ];
    case RoomAmenity.SEA_VIEW:
      return [
        {
          id: roomAmenity,
          Icon: SeaViewIcon,
          title: t("Sea view"),
        },
      ];
    case RoomAmenity.GARDEN_VIEW:
      return [
        {
          id: roomAmenity,
          Icon: GardenViewIcon,
          title: t("Garden view"),
        },
      ];
    case RoomAmenity.MOUNTAIN_VIEW:
      return [
        {
          id: roomAmenity,
          Icon: MountainIcon,
          title: t("Mountain view"),
        },
      ];
    case RoomAmenity.CITY_VIEW:
      return [
        {
          id: roomAmenity,
          Icon: CityIcon,
          title: t("City view"),
        },
      ];
    case RoomAmenity.POOL_VIEW:
      return [
        {
          id: roomAmenity,
          Icon: PoolIcon,
          title: t("Pool view"),
        },
      ];
    case RoomAmenity.NON_SMOKING_ROOMS:
      return [
        {
          id: roomAmenity,
          Icon: NoSmokingIcon,
          title: t("Non-smoking"),
        },
      ];
    case RoomAmenity.DESK:
      return [
        {
          id: roomAmenity,
          Icon: DeskIcon,
          title: t("Desk"),
        },
      ];
    case RoomAmenity.ADDITIONAL_BATHROOM:
      return [
        {
          id: roomAmenity,
          Icon: BathroomIcon,
          title: t("Additional bathroom"),
        },
      ];
    case RoomAmenity.ADDITIONAL_TOILET:
      return [
        {
          id: roomAmenity,
          Icon: ToiletIcon,
          title: t("Additional toilet"),
        },
      ];
    case RoomAmenity.BATH_ROBE:
      return [
        {
          id: roomAmenity,
          Icon: RobeIcon,
          title: t("Bath robe"),
        },
      ];
    case RoomAmenity.SHAMPOO:
      return [
        {
          id: roomAmenity,
          Icon: ToiletriesIcon,
          title: t("Shampoo"),
        },
      ];
    case RoomAmenity.CONDITIONER:
      return [
        {
          id: roomAmenity,
          Icon: ToiletriesIcon,
          title: t("Conditioner"),
        },
      ];
    case RoomAmenity.SLIPPERS:
      return [
        {
          id: roomAmenity,
          Icon: SlippersIcon,
          title: t("Slippers"),
        },
      ];
    case RoomAmenity.PAJAMAS:
      return [
        {
          id: roomAmenity,
          Icon: DefaultIcon,
          title: t("Pajamas"),
        },
      ];
    case RoomAmenity.SHOWER_CHAIR:
      return [
        {
          id: roomAmenity,
          Icon: ChairIcon,
          title: t("Shower chair"),
        },
      ];
    case RoomAmenity.SEATING_AREA:
      return [
        {
          id: roomAmenity,
          Icon: ArmchairIcon,
          title: t("Seating area"),
        },
      ];
    case RoomAmenity.SOFA:
      return [
        {
          id: roomAmenity,
          Icon: SofaIcon,
          title: t("Sofa"),
        },
      ];
    case RoomAmenity.SOFA_BED:
      return [
        {
          id: roomAmenity,
          Icon: SofaIcon,
          title: t("Sofa bed"),
        },
      ];
    case RoomAmenity.SATELLITE_CHANNELS:
      return [
        {
          id: roomAmenity,
          Icon: TVIcon,
          title: t("Satellite channels"),
        },
      ];
    case RoomAmenity.BLACKOUT_CURTAINS:
      return [
        {
          id: roomAmenity,
          Icon: DefaultIcon,
          title: t("Blackout curtains"),
        },
      ];
    case RoomAmenity.TELEPHONE:
      return [
        {
          id: roomAmenity,
          Icon: PhoneIcon,
          title: t("Telephone"),
        },
      ];
    case RoomAmenity.COFFEE_MACHINE:
      return [
        {
          id: roomAmenity,
          Icon: CoffeeIcon,
          title: t("Coffee machine"),
        },
      ];
    case RoomAmenity.COFFEE_OR_TEA_MAKER:
      return [
        {
          id: roomAmenity,
          Icon: CoffeeIcon,
          title: t("Coffee or tea maker"),
        },
      ];
    case RoomAmenity.OVEN:
      return [
        {
          id: roomAmenity,
          Icon: OvenIcon,
          title: t("Oven"),
        },
      ];
    case RoomAmenity.STOVE:
      return [
        {
          id: roomAmenity,
          Icon: KitchenIcon,
          title: t("Stove"),
        },
      ];
    case RoomAmenity.TOASTER:
      return [
        {
          id: roomAmenity,
          Icon: ToasterIcon,
          title: t("Toaster"),
        },
      ];
    case RoomAmenity.DISHWASHER:
      return [
        {
          id: roomAmenity,
          Icon: DishWasherIcon,
          title: t("Dishwasher"),
        },
      ];
    case RoomAmenity.WASHING_MACHINE:
      return [
        {
          id: roomAmenity,
          Icon: WashingMashineIcon,
          title: t("Washing machine"),
        },
      ];
    default:
      return [];
  }
};

export const getRoomAmenities = (amenities: RoomAmenity[], t: TFunction) =>
  amenities.reduce(
    (constructedDetails, amenity) => [...constructedDetails, ...getRoomAmenity(amenity, t)],
    [] as SharedTypes.Icon[]
  );

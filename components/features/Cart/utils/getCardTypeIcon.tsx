import { ElementType } from "react";

import { CardType } from "../types/cartEnums";

import NoCardIcon from "components/icons/cart/nocard.svg";
import VisaIcon from "components/icons/cart/visa.svg";
import MasterCardIcon from "components/icons/cart/mc.svg";
import MaestroIcon from "components/icons/cart/maestro.svg";
import AmexIcon from "components/icons/cart/amex.svg";
import UnionPayIcon from "components/icons/cart/unionpay.svg";
import CarteBancaireIcon from "components/icons/cart/cartebancaire.svg";
import JCBIcon from "components/icons/cart/jcb.svg";

const getCardTypeIcon = (cardType?: CardType, DefaultCardIcon?: ElementType): ElementType => {
  let cardIcon: ElementType;

  switch (cardType) {
    case CardType.VISA:
      cardIcon = VisaIcon;
      break;
    case CardType.MASTERCARD:
      cardIcon = MasterCardIcon;
      break;
    case CardType.MAESTRO:
      cardIcon = MaestroIcon;
      break;
    case CardType.AMEX:
      cardIcon = AmexIcon;
      break;
    case CardType.UNIONPAY:
      cardIcon = UnionPayIcon;
      break;
    case CardType.CARTE_BANCAIRE:
      cardIcon = CarteBancaireIcon;
      break;
    case CardType.JCB:
      cardIcon = JCBIcon;
      break;
    default:
      cardIcon = DefaultCardIcon || NoCardIcon;
  }

  return cardIcon;
};

export default getCardTypeIcon;

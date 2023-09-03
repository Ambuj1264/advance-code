import "lib/initSentry-web";
import {
  StaticErrorPage,
  getErrorPageStaticProps,
} from "components/features/ErrorPage/getErrorPageStaticProps";
import { IPTHost } from "layer0RoutesConstants";

export const getStaticProps = getErrorPageStaticProps(IPTHost);

export default StaticErrorPage;

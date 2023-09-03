// eslint-disable-next-line no-restricted-imports
import dynamic, { DynamicOptions, Loader } from "next/dynamic";

import componentLoader from "components/ui/LazyComponentLoader";

const CustomNextDynamic = <P = {}>(
  dynamicOptions: DynamicOptions<P> | Loader<P>,
  { loading = () => null, ssr }: { loading?: (props: any) => JSX.Element | null; ssr?: boolean }
): React.ComponentType<P> =>
  dynamic(() => componentLoader(dynamicOptions), {
    loading,
    ssr,
  });

export default CustomNextDynamic;

import { useContext } from "react";

import LocaleContext from "contexts/LocaleContext";

const useActiveLocale = () => useContext(LocaleContext);

export default useActiveLocale;

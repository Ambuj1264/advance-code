/**
 * Uses in useQueryParams lib
 *
 * 'pushIn': Push just a single parameter, leaving the rest as is (back button works) (the default)
 * 'push': Push all parameters with just those specified (back button works)
 * 'replaceIn': Replace just a single parameter, leaving the rest as is
 * 'replace': Replace all parameters with just those specified
 */
export enum QueryParamTypes {
  PUSH_IN = "pushIn",
  PUSH = "push",
  REPLACE_IN = "replaceIn",
}

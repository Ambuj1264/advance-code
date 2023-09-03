/* @generated */
/* eslint-disable */
export default {
  "locale": "fr",
  "pluralRuleFunction": function fr(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
}
};
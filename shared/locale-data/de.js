/* @generated */
/* eslint-disable */
export default {
  "locale": "de",
  "pluralRuleFunction": function _3(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
};
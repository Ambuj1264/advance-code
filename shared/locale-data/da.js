/* @generated */
/* eslint-disable */
export default {
  "locale": "da",
  "pluralRuleFunction": function da(n, ord) {
  var s = String(n).split('.'), i = s[0], t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return (n == 1 || !t0 && (i == 0
          || i == 1)) ? 'one' : 'other';
}
};
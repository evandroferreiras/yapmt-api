export const dateMmDd = function dateDdMm (dt) {
  var mm = dt.getMonth() + 1
  var dd = dt.getDate()
  return [
    (mm > 9 ? '' : '0') + mm, '/',
    (dd > 9 ? '' : '0') + dd
  ].join('')
}

export default function fixNumber (x){
  if (typeof x == 'string' && x.length > 5) {
    var fixed1 = x.substr(0, 6).replace(',', '.')
    var fixed2 = Number.parseFloat(fixed1).toFixed(4)
    return fixed2
  } else if (typeof x == 'string' && x.length <= 5) {
    var fixed3 = x.replace(',', '.')
    var fixed4 = Number.parseFloat(fixed3).toFixed(4)
    return fixed4
  } else if (typeof x == 'number') {
    return x.toFixed(4)
  }
}
